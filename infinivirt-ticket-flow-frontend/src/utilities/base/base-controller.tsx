import { toast } from "react-toastify";
import AppException from "../../data/exceptions/app-exception";
import ArgumentNullException from "../../data/exceptions/argument-null-exception";
import BadGatewayException from "../../data/exceptions/bad-gateway-exception";
import BadRequestException from "../../data/exceptions/bad-request-exception";
import InternalServerException from "../../data/exceptions/internal-server-exception";
import NotFoundException from "../../data/exceptions/not-found-exception";
import ServiceUnavailableException from "../../data/exceptions/service-unaviable-exception";
import TimeoutException from "../../data/exceptions/timeout-exception";
import UnauthorizedException from "../../data/exceptions/unauthorize-exception";
import { useGlobalStore } from "../../presentation/storage/zustand-store";

type ApiRequest<T> = {
  onError?: (exception: any) => void;
  onSuccess?: (response: T) => void;
  onStart?: () => void;
  onComplete?: () => void;
};

export class BaseController {

  globalState = useGlobalStore.getState();

  showSuccessToast(title: string, description: string) {
    console.log(" title -> " + title + " description -> " + description);
    toast.success(description, { autoClose: 1200 });
    // this.globalState.showToast("check",title,description, 10);
  }

  showWarningToast(title: string, description: string) {
    console.log(" title -> " + title + " description -> " + description);
    //this.globalState.showToast("warning",title,description);
    toast.warning(description, { autoClose: 1200 });
  }

  showErrorToast(title: string, description: string) {
    console.log(" title -> " + title + " description -> " + description);
    //this.globalState.showToast("error",title,description);
    toast.error(description, { autoClose: 1200 });
  }

  //PopUp

//   showSuccessPopUp(title: string, description: string) {
//     this.globalState.showPopUp("success", title, description);
//   }

//   showWarningPopUp(title: string, description: string) {
//     this.globalState.showPopUp("warning", title, description);
//   }

//   showErrorPopUp(title: string, description: string) {
//     this.globalState.showPopUp("error", title, description);
//   }

  showLoading() {
    this.globalState.setLoading(true);
  }

  hideLoading() {
    this.globalState.setLoading(false);
  }

  showErrorAlert(_exception: Error) {
    if (
      _exception instanceof ArgumentNullException ||
      _exception instanceof AppException ||
      _exception instanceof InternalServerException ||
      _exception instanceof NotFoundException ||
      _exception instanceof BadRequestException ||
      _exception instanceof ServiceUnavailableException ||
      _exception instanceof UnauthorizedException ||
      _exception instanceof BadGatewayException ||
      _exception instanceof TimeoutException
    ) {
      
      this.hideLoading();
      let title = 'Ups!';
      if (_exception instanceof AppException ||
        _exception instanceof InternalServerException) {
        title = 'Algo salió mal';
      }
      if (_exception.message.includes("parece ser") || _exception.message.includes("Los datos no coinciden") || _exception.message.includes("limite") || _exception.message.includes("llegó")) {
        title = "Uy!";
      }
      if (_exception.message.includes("plan activo") || _exception.message.includes("disfrutando ")) {
        title = "Hey!";
      }
      if (_exception.message.includes("debes abrir")) {
        title = "¡Casi lo tenemos!";
      }
      if (_exception.message.includes("nos perdimos")) {
        title = 'Ups!';
      }
      this.showErrorToast(title, _exception.message);
    } else {
      this.hideLoading();
      this.showWarningToast('Ups!', 'Ha ocurrido un problema con la red');
    }
  }

  async apiRequest<T>(future: Promise<T>, controls: ApiRequest<T>): Promise<T | undefined> {
    const { onStart, onComplete, onSuccess, onError } = controls;
    let _exception: Error | undefined;

    try {
      onStart ? onStart() : this.showLoading();

      const response: T = await future;
      onSuccess?.(response);

      onComplete ? onComplete() : this.hideLoading();
      return response;

    } catch (exception) {
      _exception = exception as Error;
      onError ? onError(_exception) : this.showErrorAlert(_exception);
    } finally {
      if (!onComplete) {
        this.hideLoading();
      } else {
        onComplete();
      }
    }

    return undefined;
  }

}