class BaseException extends Error {
    statusCode: number; 
    errorDetails?: string;
    constructor(message: string, statusCode: number, errorDetails?: string) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      this.errorDetails = errorDetails;
    }
}

export default BaseException;