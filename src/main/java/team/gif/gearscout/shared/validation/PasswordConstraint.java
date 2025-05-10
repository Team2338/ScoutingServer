package team.gif.gearscout.shared.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@NotNull(message = "Field 'password' must not be null")
@Size(min = 8, max = 32, message = "Field 'password' must have length between {min} - {max}")
@Constraint(validatedBy = {})
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordConstraint {
	String message() default "Malformed password";
	Class<?>[] groups() default {};
	Class<? extends Payload>[] payload() default {};
}
