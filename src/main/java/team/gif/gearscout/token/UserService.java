package team.gif.gearscout.token;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class UserService {

	private final UserRepository userRepository;

	@Autowired
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}


	public UserEntity createUser(UserCreateRequest info) {
		UserEntity user = new UserEntity();
		user.setEmail(info.email());
		user.setTeamNumber(info.teamNumber());
		user.setUsername(info.username());
		user.setRole("UNVERIFIED_MEMBER");

		return userRepository.save(user);
	}

	public UserEntity findUserById(Long id) {
		return userRepository.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
	}

	public UserEntity findUserByEmail(String email) throws ResponseStatusException {
		return userRepository.findByEmail(email)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
	}

}
