import BaseApiException from "./base-api-exception";

class UnauthorizedException extends BaseApiException {
    constructor(message?: string) {
      super(message ?? 'ERROR 401: No autorizado', 401);
    }
}

export default UnauthorizedException;