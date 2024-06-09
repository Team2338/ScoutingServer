package team.gif.gearscout.token;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class CredentialServiceV2 {

	private final CredentialRepositoryV2 credentialRepository;
	private final PasswordEncoder passwordEncoder;


	@Autowired
	public CredentialServiceV2(CredentialRepositoryV2 credentialRepository, PasswordEncoder passwordEncoder) {
		this.credentialRepository = credentialRepository;
		this.passwordEncoder = passwordEncoder;
	}


	public void saveCredentials(Long userId, String password) {
		CredentialEntityV2 credentials = new CredentialEntityV2(userId, passwordEncoder.encode(password));
		credentialRepository.save(credentials);
	}

	public boolean checkIfCredentialsMatch(Long userId, String password) {
		CredentialEntityV2 credentials = credentialRepository.findCredentialsByUserId(userId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

		return passwordEncoder.matches(password, credentials.getPassword());
	}

}
