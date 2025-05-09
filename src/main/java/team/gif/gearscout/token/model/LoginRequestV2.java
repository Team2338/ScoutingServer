package team.gif.gearscout.token.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record LoginRequestV2(
	@Email(message = "Field 'email' appears malformed")
	@Size(max = 254, message = "Field 'email' must have length <= 254")
	String email,

	@Size(min = 8, max = 32, message = "Field 'password' must have length between 8 - 32")
	String password
) {}
