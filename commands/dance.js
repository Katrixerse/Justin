const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    const embed = new Discord.RichEmbed()
        .setDescription(`${message.author.username} starts dancing...`)
        .setImage('https://media.giphy.com/media/11lxCeKo6cHkJy/giphy.gif');
    message.channel.send(embed);
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'roleplay'
};

exports.help = {
    name: 'dance',
    description: 'Dance a bit.',
    usage: 'dance @User'
};