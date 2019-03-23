const Discord = require("discord.js");
const config = require('../assets/json/config.json');
exports.run = async (client, message) => {
    try {
        const embed = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .addField(`Bots current version is: `, `${config.version}`);
        return message.channel.send(embed);
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
    name: 'version',
    description: 'Sends the current bot version.',
    usage: 'version'
};