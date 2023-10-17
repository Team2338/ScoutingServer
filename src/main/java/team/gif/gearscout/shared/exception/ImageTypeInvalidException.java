package team.gif.gearscout.shared.exception;

import java.util.List;

public class ImageTypeInvalidException extends RuntimeException {
	
	public ImageTypeInvalidException(String value, List<String> supported) {
		super("File content type not supported. Received '%s' but only [%s] are supported."
			.formatted(value, String.join(", ", supported))
		);
	}
	
}
