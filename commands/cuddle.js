const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    if (message.mentions.users.size < 1) return message.channel.send("you can't cuddle nobody.");
    let user = message.guild.member(message.mentions.users.first());
        const embed = new Discord.RichEmbed()
            .setDescription(`${user} You got a cuddle from ${message.author.username} ❤`)
            .setImage('https://i.imgur.com/0yAIWbg.gif');
        message.channel.send(embed);
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'roleplay'
};

exports.help = {
    name: 'cuddle',
    description: 'Give a user a cuddle.',
    usage: 'cuddle @User'
};
 
