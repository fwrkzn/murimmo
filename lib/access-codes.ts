export const VISITOR_ACCESS_COOKIE = "visitor_access_code";

export function normalizeAccessCode(code: string) {
  return code.trim().toUpperCase();
}
