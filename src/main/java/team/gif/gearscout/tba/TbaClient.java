package team.gif.gearscout.tba;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpClient.Redirect;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Optional;

public class TbaClient {
	private static final Logger logger = LogManager.getLogger(TbaClient.class);
	private static final String baseUri = "https://www.thebluealliance.com/api/v3/";
	private static final long minCacheAgeSeconds = 1800; // we don't need match results, only the schedule, so a slow refresh is fine

	private final HttpClient httpClient = getHttpClient();

	private final String tbaApiKey;
	private final HashMap<String, GetAllMatchesForEventResponse> cachedMatchResponses;

	public TbaClient(String tbaApiKey) {
		this.tbaApiKey = tbaApiKey;
		this.cachedMatchResponses = new HashMap<>();
	}

	public boolean isOk() {
		try {
			HttpRequest request = getHttpRequest("status").build();
			HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
			return response.statusCode() == 200;
		} catch (Exception e) {
			logger.error("Failed to send isOk request", e);
			return false;
		}
	}

	/**
	 * Query TBA's /event/{eventKey}/matches/simple endpoint.
	 */
	public ArrayList<MatchScheduleEntry> getMatchSchedule(String eventKey) {
		// check if current cache entry is valid
		GetAllMatchesForEventResponse resp = cachedMatchResponses.get(eventKey);
		long now = System.currentTimeMillis();
		if (resp != null && now < resp.expiration) {
			long timeToExpiry = (resp.expiration - now) / 1000;
			logger.info("Using cached match schedule ({} secs to expiry)", timeToExpiry);
			return resp.data;
		}

		// send out a request
		HttpResponse<String> response = null;

		try {
			HttpRequest.Builder builder = getHttpRequest("/event/" + eventKey + "/matches/simple")
				.setHeader("Cache-Control", "max-age=3600");
			if (resp != null && resp.cacheTag != null) {
				builder = builder.setHeader("If-None-Match", resp.cacheTag);
			}

			HttpRequest request = builder.build();
			response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
		} catch (Exception e) {
			logger.error("Failed while querying TBA", e);
		}

		return updateMatchCache(eventKey, response);
	}

	private ArrayList<MatchScheduleEntry> updateMatchCache(String eventKey, HttpResponse<String> response) {
		GetAllMatchesForEventResponse oldResp = cachedMatchResponses.get(eventKey);

		if (response == null) {
			if (oldResp == null) {
				return null;
			} else {
				return oldResp.data;
			}
		}

		GetAllMatchesForEventResponse newResp = new GetAllMatchesForEventResponse(response);

		if (response.statusCode() == 304) {
			// "not modified" response -> bump up the cache expiration time and return cached data
			oldResp.expiration = newResp.expiration;
			cachedMatchResponses.put(eventKey, oldResp);
			return oldResp.data;
		} else if (response.statusCode() == 200 && newResp.data != null) {
			// new data arrived, update cache
			logger.warn("Fresh data received from TBA, updating cache entry");
			cachedMatchResponses.put(eventKey, newResp);
			return newResp.data;
		} else {
			// something weird happened, ignore the new response
			logger.warn("Unexpected status {} from TBA", response.statusCode());
			return oldResp.data;
		}
	}

	private HttpRequest.Builder getHttpRequest(String path) throws URISyntaxException {
		return HttpRequest.newBuilder()
			.setHeader("User-Agent", "GearScout")
			.setHeader("accept", "application/json")
			.setHeader("X-TBA-Auth-Key", tbaApiKey)
			.uri(new URI(baseUri + path))
			.GET();
	}

	// Scaffolding for HTTPS client that talks to TBA
	private static HttpClient getHttpClient() {
		TrustManager[] trustAllCertificates = new TrustManager[]{
			new X509TrustManager() {
				public X509Certificate[] getAcceptedIssuers() {
					return null;
				}

				public void checkClientTrusted(X509Certificate[] certs, String authType) {
				}

				public void checkServerTrusted(X509Certificate[] certs, String authType) {
				}
			}
		};

		SSLContext sslContext = null;
		try {
			sslContext = SSLContext.getInstance("TLS");
			sslContext.init(null, trustAllCertificates, new java.security.SecureRandom());
		} catch (Exception e) {
			logger.error("Failed to init SSL context", e);
		}

		return HttpClient.newBuilder()
			.sslContext(sslContext)
			.connectTimeout(Duration.ofSeconds(10))
			.followRedirects(Redirect.ALWAYS)
			.build();
	}

	static class GetAllMatchesForEventResponse {
		ArrayList<MatchScheduleEntry> data;
		String cacheTag;
		long expiration;

		GetAllMatchesForEventResponse(HttpResponse<String> response) {
			try {
				JSONArray matches = new JSONArray(response.body());
				this.data = new ArrayList<>();
				for (int i = 0; i < matches.length(); ++i) {
					JSONObject obj = matches.optJSONObject(i);

					MatchScheduleEntry entry = MatchScheduleEntry.fromTbaJson(obj);
					if (entry == null) {
						// this entry was for practice mach, elims, or something else. ignore it
						continue;
					}

					this.data.add(entry);
				}
				// this.data.sort(null);
			} catch (Exception e) {
				logger.error("Error while parsing", e);
				this.data = null;
			}

			Optional<String> cacheTag = response.headers().firstValue("etag");
			if (cacheTag.isPresent()) {
				this.cacheTag = cacheTag.get();
			}

			String cacheControl = response.headers().firstValue("Cache-Control").orElse(null);
			String maxAgeString = null;
			long maxAgeInt;

			if (cacheControl != null) {
				maxAgeString = parseCacheControlHeader(cacheControl).get("max-age");
			}

			if (maxAgeString != null) {
				maxAgeInt = Integer.parseInt(maxAgeString);
			} else {
				maxAgeInt = -1;
			}

			if (maxAgeInt < minCacheAgeSeconds) {
				maxAgeInt = minCacheAgeSeconds;
			}

			this.expiration = System.currentTimeMillis() + (maxAgeInt * 1000);
		}

		private static HashMap<String, String> parseCacheControlHeader(String cacheControlHeader) {
			HashMap<String, String> directives = new HashMap<>();

			// split Cache-Control header by commas, trim whitespace
			String[] tokens = cacheControlHeader.split(",");
			for (String token : tokens) {
				String[] parts = token.trim().split("=", 2);
				if (parts.length == 2) {
					// If there's an equals sign, it's a key-value pair
					directives.put(parts[0].trim(), parts[1].trim());
				} else {
					// Otherwise, it's just a directive without a value
					directives.put(parts[0].trim(), null);
				}
			}

			return directives;
		}
	}
}
