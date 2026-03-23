// ==WebhookPlugin==
// @name         Command Service Bridge
// @namespace    github.com/openilink
// @version      1.2.1
// @description  Forward WeChat text messages to an HTTP command service and reply with text and normalize image payloads
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
  var content = "";
  var kind = "";

  try {
    data = JSON.parse(ctx.res.body || "{}");
  } catch (e) {
    data = null;
  }

  if (!data) {
    if (ctx.res && typeof ctx.res.body === "string") {
      text = String(ctx.res.body).replace(/^\s+|\s+$/g, "");
      if (text) reply(text);
    }
    return;
  }

  kind = typeof data.type === "string" ? data.type : "text";
  content = typeof data.content === "string" ? data.content : "";

  if (kind === "image") {
    if (/^https?:\/\//i.test(content)) {
      reply(content);
      return;
    }

    if (/^data:/i.test(content)) {
      content = content.indexOf(",") >= 0 ? content.split(",", 2)[1] : content;
    }

    if (content) {
      reply("接口返回了图片数据，但当前 OpenILink Webhook 插件 reply() 仅支持文本消息，暂时无法直接回传图片，御坂如实地报告道。");
      return;
    }

    reply("接口返回了图片内容，但当前插件运行时无法直接发送该图片格式，御坂如实地报告道。");
    return;
  }

  if (content) {
    text = content;
  } else if (typeof data.message === "string") {
    text = data.message;
  } else if (ctx.res && typeof ctx.res.body === "string") {
    text = ctx.res.body;
  }

  text = String(text || "").replace(/^\s+|\s+$/g, "");
  if (text) {
    reply(text);
  }
}
