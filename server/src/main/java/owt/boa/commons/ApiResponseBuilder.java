package owt.boa.commons;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ApiResponseBuilder {
    public static <T> ResponseEntity<ApiResponse<T>> build(
            HttpStatus status, T data, String message, String key, boolean notify) {
        return new ResponseEntity<>(
                new ApiResponse<>(status.value(), data, message, key, notify),
                status
        );
    }
}
