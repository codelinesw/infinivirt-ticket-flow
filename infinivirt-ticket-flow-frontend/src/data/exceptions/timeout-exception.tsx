import BaseApiException from "./base-api-exception";

class TimeoutException extends BaseApiException {
    constructor() {
      super('La solicitud hacia el servidor ha execido el tiempo de espera', 408);
    }
}

export default TimeoutException;