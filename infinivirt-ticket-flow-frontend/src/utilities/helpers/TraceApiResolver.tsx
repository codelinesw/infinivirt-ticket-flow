// trace-resolver.ts

import { TRACE_MESSAGES, type Lang } from "./TraceApiResponse";


export const resolveTraceMessage = (params: {
  traceCode?: number;
  lang: Lang;
  backendMessage?: string;
})  => {
  const { traceCode, lang, backendMessage } = params;

  if (traceCode && TRACE_MESSAGES[traceCode]?.[lang]) {
    return TRACE_MESSAGES[traceCode][lang];
  }

  // fallback: mensaje del backend si sirve, o genérico
  return (
    backendMessage ||
    (lang === 'en'
      ? 'Something went wrong.'
      : lang === 'pt-BR'
        ? 'Algo deu errado.'
        : 'Algo salió mal.')
  );
}
