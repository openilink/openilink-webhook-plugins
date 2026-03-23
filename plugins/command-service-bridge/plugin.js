// ==WebhookPlugin==
// @name         Command Service Bridge
// @namespace    github.com/openilink
// @version      1.1.0
// @description  Forward WeChat text messages to an HTTP command service and reply with the returned content
// @author       Awsl
// @license      MIT
// @homepage     https://github.com/openilink/openilink-webhook-plugins
// @icon         🛰️
// @match        text
// @connect      bhwa233-api.vercel.app
// @grant        reply,skip
// ==/WebhookPlugin==

function onRequest(ctx) {
  var command = (ctx.msg && ctx.msg.content) ? String(ctx.msg.content) : "";
  command = command.replace(/^\s+|\s+$/g, "");

  if (!command) {
    skip();
    return;
  }

  ctx.req.url = "https://bhwa233-api.vercel.app/api/command";
  ctx.req.method = "POST";
  ctx.req.headers = ctx.req.headers || {};
  ctx.req.headers["accept"] = "application/json";
  ctx.req.headers["Content-Type"] = "application/json";
  ctx.req.body = JSON.stringify({
    command: command
  });
}

function onResponse(ctx) {
  var data;
  var text = "";

  try {
    data = JSON.parse(ctx.res.body || "{}");
  } catch (e) {
    data = null;
  }

  if (data && typeof data.content === "string") {
    text = data.content;
  } else if (data && typeof data.message === "string") {
    text = data.message;
  } else if (ctx.res && typeof ctx.res.body === "string") {
    text = ctx.res.body;
  }

  if (!text) {
    return;
  }

  text = String(text).replace(/^\s+|\s+$/g, "");
  if (!text) {
    return;
  }

  reply(text);
}
