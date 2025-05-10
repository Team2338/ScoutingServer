package team.gif.gearscout.shared.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@NotNull(message = "Field 'robotNumber' must not be null")
@Min(value = 0, message = "Field 'robotNumber' must be ≥ {value}")
@Constraint(validatedBy = {})
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface RobotNumberConstraint {
	String message() default "Invalid robot number";
	Class<?>[] groups() default {};
	Class<? extends Payload>[] payload() default {};
}
