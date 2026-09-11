import BaseApiException from "./base-api-exception";

class NotFoundException extends BaseApiException {
  constructor(message?: string) {
    super(message || 'Error 404: Recurso no encontrado', 404);
  }
}

export default NotFoundException;