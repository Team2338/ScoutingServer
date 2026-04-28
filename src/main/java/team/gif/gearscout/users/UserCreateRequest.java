package team.gif.gearscout.users;

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
