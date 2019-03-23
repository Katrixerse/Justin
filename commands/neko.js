const Discord = require("discord.js");
const request = require('node-superfetch');
exports.run = async (client, message, args) => {
    try {
        const { body } = await request
            .get('https://nekos.life/api/lewd/neko')

        if (!message.channel.nsfw) return message.channel.send("Cannot send NSFW content in a SFW channel.");
        const embed = new Discord.RichEmbed()
            .setImage(body.neko);
        return message.channel.send(embed);
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'nsfw'
};

exports.help = {
    name: 'neko',
    description: 'Gets a random image off of Neko API.',
    usage: 'neko'
};