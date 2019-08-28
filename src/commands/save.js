const axios = require("axios").default;
const winston = require("winston");

const { apiEndpoint, apiKey, botPrefix } = require("../config");
const { replyWithInsult } = require("../utils");

module.exports = {
  name: "save",
  description: "Save a link.",
  usage: "https://example.com enter,tags,here",
  execute: async (message, args) => {
    if (!args[0] || !args[1]) {
      message.react("❌");
      await replyWithInsult(
        message,
        `Two arguments are required. See \`${botPrefix} help save\``
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
        { url: args[0], tags: args[1] },
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
