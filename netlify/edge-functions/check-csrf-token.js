import { decryptString } from "./utils/crypto.js";

export default async function (request, context) {
  // get form input
  const formData = await request.formData();
  const csrfFormToken = formData.get("csrf_token");
  const csrfCookieToken = context.cookies.get("csrf_cookie_token");

  if (csrfFormToken === null || csrfCookieToken === null) {
    return new Response("CSRF tokens missing", { status: 403 });
  }

  const decryptedFormToken = decryptString(
    csrfFormToken,
    Deno.env.get("CSRF_FORM_INPUT_SECRET")
  );
  const decryptedCookieToken = decryptString(
    csrfCookieToken,
    Deno.env.get("CSRF_COOKIE_SECRET")
  );

  if (decryptedFormToken !== decryptedCookieToken) {
    return new Response("CSRF tokens do not match", { status: 403 });
  }

  const name = formData.get("name");

  return new Response(`Hello ${name}!`, { status: 200 });
}
