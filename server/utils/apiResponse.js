class ApiResponse {
    constructor(statusCode, data, message = 'Success') {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
    }
}

class ApiPaginatedResponse extends ApiResponse {
    constructor(statusCode, data, message = 'Success', pagination) {
        super(statusCode, data, message);
        this.pagination = pagination;
    }
}

export { ApiResponse, ApiPaginatedResponse };
