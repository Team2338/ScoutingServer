package team.gif.gearscout.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team.gif.gearscout.model.CredentialEntity;
import team.gif.gearscout.model.LoginResponse;
import team.gif.gearscout.repository.CredentialRepository;

import javax.transaction.Transactional;

@Service
@Transactional
public class AuthService {
	
	private final CredentialRepository credentialRepository;
	
	@Autowired
	public AuthService(CredentialRepository credentialRepository) {
		this.credentialRepository = credentialRepository;
	}
	
	public LoginResponse getRole(Integer teamNumber, String username) {
		String role = credentialRepository
			.getCredentials(teamNumber, username)
			.map(CredentialEntity::getRole)
			.orElse("none");
		
		return new LoginResponse(teamNumber, username, role);
	}
	
}
