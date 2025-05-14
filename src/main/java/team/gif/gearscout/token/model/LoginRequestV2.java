package team.gif.gearscout.token.model;

import team.gif.gearscout.shared.validation.EmailConstraint;
import team.gif.gearscout.shared.validation.PasswordConstraint;

public record LoginRequestV2(
	@EmailConstraint
	String email,

	@PasswordConstraint
	String password
) {}
