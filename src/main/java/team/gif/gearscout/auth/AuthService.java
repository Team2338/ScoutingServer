package team.gif.gearscout.auth;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AuthService {
	
	private final CredentialRepository credentialRepository;
	private final ObjectMapper mapper;
	
	@Autowired
	public AuthService(CredentialRepository credentialRepository) {
		this.credentialRepository = credentialRepository;
		this.mapper = new ObjectMapper();
	}
	
	public LoginResponse getRole(Integer teamNumber, String username) {
		String role = credentialRepository
			.getCredentials(teamNumber, username)
			.map(CredentialEntity::getRole)
			.orElse("none");
		
		return new LoginResponse(teamNumber, username, role);
	}
	
	public LoginResponse validateToken(String token) throws JsonProcessingException {
		LoginResponse deserializedToken = mapper.readValue(token, LoginResponse.class);
		return validateToken(deserializedToken);
	}
	
	public LoginResponse validateToken(LoginResponse token) {
		return getRole(token.teamNumber(), token.username());
	}
	
}
