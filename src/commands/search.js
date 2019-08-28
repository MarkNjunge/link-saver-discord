const Discord = require("discord.js");
const axios = require("axios").default;
const winston = require("winston");

const { apiEndpoint, apiKey, botPrefix } = require("../config");
const { replyWithInsult } = require("../utils");

module.exports = {
  name: "search",
  description: "Search for a link",
  usage: "node 5[limit, optional] 1[page, optional]",
  guildOnly: true,
  execute: async (message, args) => {
    if (!args[0]) {
      message.react("❌");
      await replyWithInsult(
        message,
        `A search term is required. See \`${botPrefix} help search\``
      );
      return;
    }

    var limit = 5;
    if (args[1]) {
      limit = args[1];
    }
    var page = 1;
    if (args[2]) {
      page = args[2];
    }

    try {
      const res = await axios.get(
        `${apiEndpoint}/search?query=${args[0]}&limit=${limit}&page=${page}`,
        {
          headers: {
            "content-type": "application/json",
            "x-api-key": apiKey
          }
        }
      );

      const data = res.data;

      if (data.length == []) {
        message.react("⭕");
        return;
      }

      data.forEach(link => {
        const embed = new Discord.RichEmbed()
          .setTitle(link.title)
          .setURL(link.url)
          .setDescription(link.description)
          .setThumbnail(link.image)
          .addField("Tags", link.tags)
          .setTimestamp(link.dateTimeAdded);

        message.channel.send(embed);
      });

      message.react("✅");
    } catch (e) {
      message.react("❗");
      const msg = e.response ? e.response.data.message : e;
      winston.error(msg);
    }
  }
};
