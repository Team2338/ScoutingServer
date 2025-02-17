package team.gif.gearscout.users;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record UserCreateRequest(
	@Email(message = "Field 'email' appears malformed")
	@Size(max = 254, message = "Field 'email' must have length <= 254")
	String email,

	@Size(min = 8, max = 32, message = "Field 'password' must have length between 8 - 32")
	String password,

	@Min(value = 0, message = "Field 'teamNumber' must be >= 0")
	Integer teamNumber,

	@Size(min = 1, max = 32, message = "Field 'username' must have length between 1 - 32")
	String username
) {
}
