import { getSiteUrl } from "@/lib/site";

export type ActionResult =
  | { ok: true; message?: string; id?: string }
  | {
      ok: false;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };

export function actionError(
  message: string,
  fieldErrors?: Record<string, string[]>,
): ActionResult {
  return { ok: false, message, fieldErrors };
}

export function actionSuccess(message?: string, id?: string): ActionResult {
  return { ok: true, message, id };
}

export function zodFieldErrors(
  error: { flatten: () => { fieldErrors: Record<string, string[] | undefined>; formErrors: string[] } },
): Record<string, string[]> {
  const flattened = error.flatten();
  const fields: Record<string, string[]> = {};
  for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
    if (messages?.length) fields[key] = messages;
  }
  if (flattened.formErrors.length) fields._form = flattened.formErrors;
  return fields;
}

export function siteOrigin(fallback = getSiteUrl()) {
  return fallback;
}
