const Discord = require("discord.js");
const request = require('node-superfetch')
exports.run = async (client, message, args) => {
    try {
        const { text } = await request.get("https://icanhazdadjoke.com/").set("Accept", "text/plain");
        const embed = new Discord.RichEmbed()
            .setThumbnail("https://cdn.discordapp.com/emojis/397910503013220354.png")
            .setDescription(`_${JSON.parse(text).Pun}_`)
            .setColor(6192321);
        message.channel.send(embed);
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'fun'
};

exports.help = {
    name: 'dad-joke',
    description: 'Sends you a random dad joke.',
    usage: 'dad-joke'
};