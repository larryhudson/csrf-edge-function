import CryptoJS from "https://esm.sh/crypto-js";

function generateRandomString(length = 32) {
  // Declare all characters
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Pick characers randomly
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
}

function encryptString(str, passphrase) {
  return CryptoJS.AES.encrypt(str, passphrase).toString();
}

export default async function (request, context) {
  // generate a random ID
  const randomString = getRandomString();
  // scramble that with our secret
  const formInputToken = encryptString(
    randomString,
    Deno.env.get("CSRF_FORM_INPUT_SECRET")
  );
  // set it in the form input
  const response = await context.next();
  const pageContent = await response.text();
  const regex = /{{INCLUDE_CSRF_TOKEN}}/i;
  const updatedPage = pageContent.replace(regex, formInputToken);

  // scramble it with another secret
  const cookieToken = encryptString(
    randomString,
    Deno.env.get("CSRF_COOKIE_SECRET")
  );
  // set it in the cookies
  context.cookies.set({
    name: "csrf_cookie_token",
    value: cookieToken,
    maxAge: 60 * 60,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return new Response(updatedPage, response);
}
