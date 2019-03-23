const Discord = require('discord.js');
const fs = require("fs")
const os = require('os');
var cpu = os.loadavg();
const moment = require('moment');
require('moment-duration-format');
const config = require('../assets/json/config.json');
exports.run = async (client, message) => {
    try {
        fs.readdir("./commands/", (err, files) => {
            const filez = files.length
            if (err) return console.error(err);
            const embed = new Discord.RichEmbed()
                .setAuthor(client.user.username, client.user.avatarURL)
                .setColor(0x6B363E)
                .addField("OS:", "Linux 64-bit", true)
                .addField('Node.js Version', process.version)
                .addField('Library', `discord.js ${config.djs_version}`)
                .addField('Bot version:', `${config.version}`)
                .setFooter(`Total commands: ${filez + 14}`);
            return message.channel.send(embed);
        });
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'main'
};

exports.help = {
    name: 'bot-info',
    description: 'Tells you the bots info.',
    usage: 'bot-info'
};