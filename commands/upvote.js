const Discord = require("discord.js");
const request = require('node-superfetch');
exports.run = async (client, message) => {
    if (!message.channel.nsfw) return message.channel.send("Cannot send NSFW content in a SFW channel.")
    try {
        const embed = new Discord.RichEmbed()
            .addField("Can upvote the bot at: ", "https://discordbots.org/bot/390151520722878465/vote")
        return message.channel.send(embed)
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'nsfw'
};

exports.help = {
    name: 'upvote',
    description: 'Gives you a link where you can upvote the bot.',
    usage: 'upvote'
};