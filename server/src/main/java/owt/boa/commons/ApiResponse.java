package owt.boa.commons;


public class ApiResponse<T> {

    private int status;
    private T data;
    private String message;
    private String key;
    private boolean notify;
    public ApiResponse() {
    }

    public ApiResponse(int status, T data, String message, String key, boolean notify) {
        this.status = status;
        this.data = data;
        this.message = message;
        this.key = key;
        this.notify = notify;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public boolean isNotify() {
        return notify;
    }

    public void setNotify(boolean notify) {
        this.notify = notify;
    }
}
