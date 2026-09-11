import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import AppException from '../exceptions/app-exception';
import NotFoundException from '../exceptions/not-found-exception';
import InternalServerException from '../exceptions/internal-server-exception';
import ServiceUnavailableException from '../exceptions/service-unaviable-exception';
import NetworkException from '../exceptions/network-exception';
import UnauthorizedException from '../exceptions/unauthorize-exception';
import BadRequestException from '../exceptions/bad-request-exception';
import BadGatewayException from '../exceptions/bad-gateway-exception';
import TimeoutException from '../exceptions/timeout-exception';
import { resolveTraceMessage } from '../../utilities/helpers/TraceApiResolver';
import type { Lang } from '../../utilities/helpers/TraceApiResponse';

const API_URL_BASE = import.meta.env.VITE_API_URL;

export interface RequestOptions extends AxiosRequestConfig {
  skipAuth?: boolean;
}

export class HttpRequestWrapper {
  private axiosInstance: AxiosInstance;
  private tokenGetter?: () => string | null;

  constructor(tokenGetter?: () => string | null) {
    this.tokenGetter = tokenGetter;
    this.axiosInstance = axios.create({
      baseURL: API_URL_BASE,
      withCredentials: true,
      withXSRFToken: true,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public setTokenGetter(fn: () => string | null): void {
    this.tokenGetter = fn;
  }

  public setBaseUrl(url?: string): void {
    if (url) {
      this.axiosInstance.defaults.baseURL = url;
    }
  }

  public setContentType(type: string): void {
    this.axiosInstance.defaults.headers.common['Content-Type'] = type;
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // const skipAuth = (config as RequestOptions).skipAuth;

        // if (!skipAuth) {
        //   const token = this.tokenGetter ? this.tokenGetter() : localStorage.getItem('token');
        //   if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        //   }
        // }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        return Promise.reject(this.handleExceptions(error));
      }
    );
  }

  private extractTrace(data: any): { traceCode?: number; backendMessage?: string } {
    const traceCodeRaw = data?.traceCode ?? data?.TraceCode ?? data?.code ?? data?.Code;
    const traceCode = typeof traceCodeRaw === 'string' ? Number(traceCodeRaw) : traceCodeRaw;
    const backendMessage = data?.Message ?? data?.message;

    return {
      traceCode: Number.isFinite(traceCode) ? traceCode : undefined,
      backendMessage,
    };
  }

  private handleExceptions(error: AxiosError): Error {
    const lang: Lang = "es";
    const data = error.response?.data;
    const { traceCode, backendMessage } = this.extractTrace(data);

    let userMessage = resolveTraceMessage({
      traceCode,
      lang,
      backendMessage,
    });

    if (userMessage.includes('límite') || userMessage.includes('llegó')) {
      userMessage = backendMessage ?? 'Algo falló... pero tranqui, lo resolveremos pronto';
    }

    if (error.code === 'ECONNABORTED') {
      return new TimeoutException();
    }

    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      const messages: Record<string, string> = {
        en: 'Network error. Could not connect to the server.',
        'pt-BR': 'Erro de rede. Não foi possível conectar ao servidor.',
      };
      return new NetworkException(messages[lang] ?? 'Error de red. No se pudo conectar al servidor.');
    }

    if (error.response) {
      switch (error.response.status) {
        case 400:
        case 422:
          return new BadRequestException(userMessage);
        case 401:
          return new UnauthorizedException(userMessage);
        case 403:
          return new UnauthorizedException(
            'No tienes permisos para ver esta información.\n Si crees que es un error, contáctanos.'
          );
        case 404:
          return new NotFoundException(userMessage);
        case 500:
          return new InternalServerException(userMessage);
        case 502:
          return new BadGatewayException();
        case 503:
          return new ServiceUnavailableException(userMessage);
        default:
          return new AppException(userMessage);
      }
    }

    return new AppException(userMessage || 'An unknown error occurred.');
  }

  public async get<T = any>(url: string, params = {}, options?: RequestOptions): Promise<T> {
    return this.axiosInstance.get(url, { params, ...options }) as unknown as T;
  }

  public async post<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.axiosInstance.post(url, data, options) as unknown as T;
  }

  public async put<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.axiosInstance.put(url, data, options) as unknown as T;
  }

  /**
   * Método PATCH genérico
   */
  public async patch<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.axiosInstance.patch(url, data, options) as unknown as T;
  }

  public async delete<T = any>(url: string, options?: RequestOptions): Promise<T> {
    return this.axiosInstance.delete(url, options) as unknown as T;
  }

  public async upload<T = any>(
    url: string,
    formData: FormData,
    onProgress?: (percent: number) => void,
    options?: RequestOptions
  ): Promise<T> {
    return this.axiosInstance.post(url, formData, {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const total = progressEvent.total ?? 0;
        if (!total) return;
        const percent = Math.round((progressEvent.loaded * 100) / total);
        onProgress?.(percent);
      },
    }) as unknown as T;
  }
}