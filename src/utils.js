const fs = require("fs");
const path = require("path");

const insults = JSON.parse(
  fs.readFileSync(path.join(__dirname, "insults.json")).toString()
);

async function replyWithInsult(message, replyContent) {
  const data = [];
  data.push(replyContent);
  data.push(getRandomInsult());
  await message.reply(data);
}

function getRandomInsult() {
  const i = Math.floor(Math.random() * Math.floor(insults.length));
  return insults[i];
}

module.exports = {
  replyWithInsult
};
