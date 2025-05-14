package team.gif.gearscout.shared;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
	private static final Logger logger = LogManager.getLogger(GlobalExceptionHandler.class);

	public record ErrorResponseBody(Collection<String> errors) {}

	@ExceptionHandler(value = MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponseBody> handleValidationErrors(MethodArgumentNotValidException ex) {
		logger.debug("Handling method argument error!");
		Set<String> errors = ex.getBindingResult()
			.getFieldErrors()
			.stream()
			.map(FieldError::getDefaultMessage)
			.collect(Collectors.toSet());

		return ResponseEntity
			.badRequest()
			.body(new ErrorResponseBody(errors));
	}

	@ExceptionHandler(value = HandlerMethodValidationException.class)
	public ResponseEntity<ErrorResponseBody> handleValidationErrors(HandlerMethodValidationException ex) {
		logger.debug("Handling method validation error!");
		Set<String> errors = ex.getAllErrors()
			.stream()
			.map(MessageSourceResolvable::getDefaultMessage)
			.collect(Collectors.toSet());

		return ResponseEntity
			.badRequest()
			.body(new ErrorResponseBody(errors));
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	public ResponseEntity<String> handleGenericException(final Exception ex) {
		logger.error("Generic error!", ex);
		return ResponseEntity.internalServerError().build();
	}

}
