const Discord = require("discord.js");
const axios = require("axios").default;
const winston = require("winston");

const { apiEndpoint, apiKey, botPrefix } = require("../config");
const { replyWithInsult } = require("../utils");

function extractSearchArgs(content) {
  const myRegexp = /[^\s"]+|"([^"]*)"/gi;
  const myArray = [];

  do {
    //Each call to exec returns the next regex match as an array
    var match = myRegexp.exec(content);
    if (match != null) {
      //Index 1 in the array is the captured group if it exists
      //Index 0 is the matched text, which we use if no captured group exists
      myArray.push(match[1] ? match[1] : match[0]);
    }
  } while (match != null);

  return myArray.slice(2);
}

module.exports = {
  name: "search",
  description: "Search for a link",
  usage: "node 5[limit, optional] 1[page, optional]",
  guildOnly: true,
  execute: async (message, args) => {
    args = extractSearchArgs(message.content);

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
          .setThumbnail(link.image)
          .setTimestamp(link.dateTimeAdded);

        if (link.tags) {
          embed.addField("Tags", link.tags);
        }
        if (link.description) {
          embed.setDescription(link.description);
        }

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
