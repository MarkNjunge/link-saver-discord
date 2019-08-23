const axios = require("axios").default;
const winston = require("winston");

const { apiEndpoint, apiKey, botPrefix } = require("../config");
const { replyWithInsult } = require("../utils");

module.exports = {
  name: "delete",
  description: "Delete link",
  usage: "https://example.com",
  execute: async (message, args) => {
    if (!args[0]) {
      message.react("❌");
      await replyWithInsult(
        message,
        `A url is required. See \`${botPrefix} help search\``
      );
      return;
    }

    try {
      await axios.delete(`${apiEndpoint}/delete`, {
        data: {
          url: args[0]
        },
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey
        }
      });

      message.react("✅");
    } catch (e) {
      message.react("❗");
      winston.error(`${e} | ${e.response.data.message}`);
    }
  }
};
