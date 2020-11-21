// version v0.0.2
// create by ruicky
// detail url: https://github.com/ruicky/jd_sign_bot

const exec = require("child_process").execSync;
const fs = require("fs");
const rp = require("request-promise");
const download = require("download");

// 公共变量
const KEY = process.env.JD_COOKIE;
const serverJ = process.env.PUSH_KEY;
const DualKey = process.env.JD_COOKIE_2;
const isNotifyRes = process.env.IS_NOTIFY_RES;
const tgBotApiSecret = process.env.TG_BOT_API_SECRET;
const tgChatId = process.env.TG_CHAT_ID;

async function downFile() {
  const url =
    "https://cdn.jsdelivr.net/gh/aaronlam/jd_sign_bot@master/jd_dailybonus.js";
  await download(url, "./");
}

async function changeFile() {
  let content = await fs.readFileSync("./jd_dailybonus.js", "utf8");
  content = content.replace(/var Key = ''/, `var Key = '${KEY}'`);
  if (DualKey) {
    content = content.replace(/var DualKey = ''/, `var DualKey = '${DualKey}'`);
  }
  await fs.writeFileSync("./jd_dailybonus.js", content, "utf8");
}

async function sendNotify(text, desp) {
  await sendWeChat(text, desp);
  await sendTelegram(text, desp);
}

async function sendWeChat(text, desp) {
  if (!serverJ) {
    return;
  }

  const options = {
    uri: `https://sc.ftqq.com/${serverJ}.send`,
    form: { text, desp },
    json: true,
    method: "POST",
  };
  await rp
    .post(options)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function sendTelegram(text, desp) {
  if (!tgBotApiSecret || !tgChatId) {
    return;
  }

  const options = {
    uri: `https://corsapi.aaronlam.xyz/http://home.ngrok.aaronlam.xyz:8000/sendbotmsg`,
    body: {
      id: tgChatId,
      msg: desp,
    },
    json: true,
    method: "POST",
    headers: {
      "X-Secret": tgBotApiSecret,
    },
  };
  await rp
    .post(options)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function start() {
  if (!KEY) {
    console.log("请填写 key 后在继续");

    return;
  }
  // 下载最新代码
  await downFile();
  console.log("下载代码完毕");
  // 替换变量
  await changeFile();
  console.log("替换变量完毕");
  // 执行
  await exec("node jd_dailybonus.js >> result.txt");
  console.log("执行完毕");

  if (isNotifyRes === "Y") {
    const path = "./result.txt";
    let content = "";
    if (fs.existsSync(path)) {
      content = fs.readFileSync(path, "utf8");
    }
    let t = content.match(/【签到概览】:((.|\n)*)【签到奖励】/);
    let res = t ? t[1].replace(/\n/, "") : "失败";
    let t2 = content.match(/【签到奖励】:((.|\n)*)【其他总计】/);
    let res2 = t2 ? t2[1].replace(/\n/, "") : "总计0";
    await sendNotify(
      "" + ` ${res2} ` + ` ${res} ` + new Date().toLocaleDateString(),
      content
    );
  }
}

start();
