const { botPrefix } = require("../config");

module.exports = {
  name: "info",
  description: "Returns info about the bot.",
  usage: "",
  execute: async message => {
    const data = [];
    data.push(
      `I am a bot that you can save links. Use \`${botPrefix} help\` to see a list of commands.`
    );
    data.push("");
    data.push(`**Prefix**: ${botPrefix}`);
    data.push("**Developer**: Mark Njung'e");
    data.push(
      "**Source Code**: https://github.com/MarkNjunge/link-saver-discord"
    );

    await message.channel.send(data);
  }
};
