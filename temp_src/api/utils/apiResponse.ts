// Generic API Response Type
export class ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;

  constructor(
    statusCode: number,
    data: T,
    message: string = "Successful Request",
    success: boolean = true
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = success;
  }
}

// Error Response Type
export class ApiError<T> extends Error {
  public statusCode: number;
  public error?: T;
  public success: boolean;
  public message: string;

  constructor(statusCode: number, error: T, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.success = false;
  }
}
