import BaseApiException from "./base-api-exception";

class InternalServerException extends BaseApiException {
  constructor(message?: string) {
    super(message || 'Error 500: Error interno del servidor', 500);
 }
}

export default InternalServerException;