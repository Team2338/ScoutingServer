package team.gif.gearscout.shared.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@NotNull(message = "Field 'email' must not be null")
@Size(max = 254, message = "Field 'email' must have length ≤ 254")
@Email
@Constraint(validatedBy = {})
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface EmailConstraint {
	String message() default "Malformed email";
	Class<?>[] groups() default {};
	Class<? extends Payload>[] payload() default {};
}
