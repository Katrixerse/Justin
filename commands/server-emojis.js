const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    try {
        const emoji = message.guild.emojis;
        if (!emoji.size) return message.channel.send("Server has no emojis.")
        const embed = new Discord.RichEmbed()
            .addField("Server Emojis", emoji.map((e) => e).join(' '))
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
    name: 'server-emojis',
    description: 'Gets all the servers emojis.',
    usage: 'server-emojis'
};