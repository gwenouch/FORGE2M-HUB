export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "forge2m-hub.pages.dev") {
    url.hostname = "forge2m.com";
    url.protocol = "https:";
    url.port = "";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
