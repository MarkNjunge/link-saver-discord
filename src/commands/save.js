const axios = require("axios").default;
const winston = require("winston");

const { apiEndpoint, apiKey, botPrefix } = require("../config");
const { replyWithInsult } = require("../utils");

module.exports = {
  name: "save",
  description: "Save a link.",
  usage: "https://example.com enter,optional,tags,here",
  execute: async (message, args) => {
    // the args param will have tags incorrectly parsed if the have spaces.
    const tags = message.content
      .split(/\$lst save http.*? /gm)
      .filter(x => x.trim().length > 0)
      .toString();

    if (!args[0]) {
      message.react("❌");
      await replyWithInsult(
        message,
        `A link is required. See \`${botPrefix} help save\``
      );
      return;
    } else if (!args[0].startsWith("http")) {
      message.react("❌");
      await replyWithInsult(message, "A valid link is required!");
      return;
    }

    try {
      await axios.post(
        `${apiEndpoint}/save`,
        { url: args[0], tags },
        {
          headers: {
            "content-type": "application/json",
            "x-api-key": apiKey
          }
        }
      );

      message.react("✅");
    } catch (e) {
      message.react("❗");
      const msg = e.response ? e.response.data.message : e;
      winston.error(msg);
    }
  }
};
