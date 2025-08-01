package com.sop.financialcontrol.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the application.
 * Handles various exceptions and returns appropriate HTTP responses.
 */
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * Handle ResourceNotFoundException.
     * Returns a 404 Not Found response with error details.
     *
     * @param ex The exception
     * @param request The web request
     * @return A ResponseEntity with error details
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDetails> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false),
                "RESOURCE_NOT_FOUND");
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle BusinessException.
     * Returns a 400 Bad Request response with error details.
     *
     * @param ex The exception
     * @param request The web request
     * @return A ResponseEntity with error details
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorDetails> handleBusinessException(
            BusinessException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false),
                "BUSINESS_RULE_VIOLATION");
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle validation exceptions.
     * Returns a 400 Bad Request response with validation error details.
     *
     * @param ex The exception
     * @param headers The HTTP headers
     * @param status The HTTP status
     * @param request The web request
     * @return A ResponseEntity with validation error details
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ValidationErrorDetails errorDetails = new ValidationErrorDetails(
                LocalDateTime.now(),
                "Validation failed",
                request.getDescription(false),
                "VALIDATION_ERROR",
                errors);

        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle all other exceptions.
     * Returns a 500 Internal Server Error response with error details.
     *
     * @param ex The exception
     * @param request The web request
     * @return A ResponseEntity with error details
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleGlobalException(
            Exception ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false),
                "INTERNAL_ERROR");
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Error details class for API responses.
     */
    public static class ErrorDetails {
        private final LocalDateTime timestamp;
        private final String message;
        private final String details;
        private final String errorCode;

        public ErrorDetails(LocalDateTime timestamp, String message, String details, String errorCode) {
            this.timestamp = timestamp;
            this.message = message;
            this.details = details;
            this.errorCode = errorCode;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public String getMessage() {
            return message;
        }

        public String getDetails() {
            return details;
        }

        public String getErrorCode() {
            return errorCode;
        }
    }

    /**
     * Validation error details class for API responses.
     */
    public static class ValidationErrorDetails extends ErrorDetails {
        private final Map<String, String> errors;

        public ValidationErrorDetails(LocalDateTime timestamp, String message, String details,
                                     String errorCode, Map<String, String> errors) {
            super(timestamp, message, details, errorCode);
            this.errors = errors;
        }

        public Map<String, String> getErrors() {
            return errors;
        }
    }
}