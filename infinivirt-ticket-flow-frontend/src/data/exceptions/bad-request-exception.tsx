import BaseApiException from "./base-api-exception";

class BadRequestException extends BaseApiException {
    constructor(message?: string) {
      super(message??"ERROR 400: Error en la respuesta del servidor", 400);
    }
}

export default BadRequestException;