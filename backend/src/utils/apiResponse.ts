export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data?: T;

  constructor(statusCode: number, data: T, message = 'Success') {
    this.success = statusCode < 400;
    this.message = message;
    if (data) {
      this.data = data;
    }
  }
}
