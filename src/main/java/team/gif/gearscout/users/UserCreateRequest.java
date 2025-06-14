package team.gif.gearscout.users;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import team.gif.gearscout.shared.validation.EmailConstraint;
import team.gif.gearscout.shared.validation.PasswordConstraint;
import team.gif.gearscout.shared.validation.TeamNumberConstraint;
import team.gif.gearscout.shared.validation.UsernameConstraint;

public record UserCreateRequest(
	@EmailConstraint
	String email,

	@PasswordConstraint
	String password,

	@TeamNumberConstraint
	Integer teamNumber,

	@UsernameConstraint
	String username
) {
}
