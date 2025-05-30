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
@NotNull(message = "Field 'username' or 'creator' must not be null")
@Size(min = 1, max = 32, message = "Field 'username' or 'creator' must have length between {min} - {max}")
@Constraint(validatedBy = {})
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface UsernameConstraint {
	String message() default "Invalid username or creator";
	Class<?>[] groups() default {};
	Class<? extends Payload>[] payload() default {};
}
