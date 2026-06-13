type LoggedError = {
  code?: string;
  details?: string;
  hint?: string;
  message?: string;
};

export function logAdminError(context: string, error: LoggedError | null | undefined) {
  if (!error) {
    return;
  }

  console.error(`[admin] ${context}`, {
    code: error.code ?? null,
    details: error.details ?? null,
    hint: error.hint ?? null,
    message: error.message ?? null
  });
}
