// ==WebhookPlugin==
// @name         Command Service Bridge
// @namespace    github.com/openilink
// @version      1.3.3
// @description  Forward WeChat text or image messages to an HTTP command service and reply with text and image responses
// @author       Awsl
// @license      MIT
// @homepage     https://github.com/openilink/openilink-webhook-plugins
// @icon         🛰️
// @match        text,image
// @connect      bhwa233-api.vercel.app
// @grant        reply,skip
// @timeout      30
// ==/WebhookPlugin==

function onRequest(ctx) {
  var command = "";
  var items = [];
  var i;

  if (ctx.msg && ctx.msg.content) {
    command = String(ctx.msg.content);
  }

  command = command.replace(/^\s+|\s+$/g, "");

  if (!command && ctx.msg && ctx.msg.msg_type === "image" && ctx.msg.items && ctx.msg.items.length) {
    items = ctx.msg.items;
    for (i = 0; i < items.length; i++) {
      if (items[i] && items[i].media_url) {
        command = String(items[i].media_url);
        break;
      }
    }
  }

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

  if (ctx.res && ctx.res.body === null) {
    reply({ forward: true });
    return;
  }

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
    if (/^data:image\//i.test(content)) {
      reply(content);
      return;
    }

    if (/^https?:\/\//i.test(content)) {
      reply(content);
      return;
    }

    if (content) {
      reply({ base64: content, filename: "bh-image.jpg" });
      return;
    }

    if (ctx.res && ctx.res.body === null) {
      reply({ forward: true });
      return;
    }

    reply("接口返回了图片内容，但未提供可发送的数据，御坂如实地报告道。");
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
