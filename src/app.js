require("dotenv").config();
const winston = require("winston");
const Discord = require("discord.js");
const fs = require("fs");

const { botToken, botPrefix } = require("./config");

initializeLogger();

const client = new Discord.Client();
client.commands = new Discord.Collection();

/**
 * Load commands
 */
const commandFiles = fs
  .readdirSync(__dirname + "/commands")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

/**
 * Listen for bot initialization
 */
client.once("ready", () => {
  winston.info(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
  if (!message.content.startsWith(botPrefix) || message.author.bot) return;

  winston.debug(
    `${message.guild ? message.guild.name + " | " : ""}` +
      `${message.author.username}#${message.author.discriminator} | ` +
      message.content
  );

  const args = message.content
    .trim()
    .slice(botPrefix.length)
    .split(/ +/)
    .filter(v => v.length > 0);

  if (args.length == 0) {
    message.reply("What?");
    return;
  }
  const command = args.shift().toLowerCase();
  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.react("❗");
    message.reply("There was an error trying to execute that command!");
  }
});

client.login(botToken);

function initializeLogger() {
  const { combine, timestamp, printf } = winston.format;
  const customFormat = printf(
    info => `${info.timestamp} ${info.level}: ${info.message}`
  );
  winston.configure({
    level: "debug",
    format: combine(timestamp(), customFormat),
    transports: [new winston.transports.Console()]
  });
}
