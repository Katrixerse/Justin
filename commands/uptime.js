const Discord = require('discord.js')
const moment = require('moment');
require('moment-duration-format');
exports.run = (client, message) => {
    try {
        const embed = new Discord.RichEmbed()
          .setTitle("Bot Uptime")
          .addField('Uptime:', moment.duration(client.uptime).format('d [days], h [hours], m [minutes], s [seconds]', { trim: "small" }), true)
          .setColor(0x6B363E)
        return message.channel.send(embed)
      } catch (err) {
          return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
      }
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'uptime',
    description: 'Tells you how long the bots been online for.',
    usage: 'uptime'
};