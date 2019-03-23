const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    if (message.mentions.users.size < 1) return message.channel.send("you can't high-five nobody")
    let user = message.guild.member(message.mentions.users.first());
        const embed = new Discord.RichEmbed()
            .setDescription(`${user} You got a high-five from ${message.author.username} :clap:`)
            .setImage('https://i.imgur.com/7BJ6gfM.gif');
        message.channel.send(embed);
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'roleplay'
};

exports.help = {
    name: 'high-five',
    description: 'Give a user a high-five.',
    usage: 'high-five'
};
 
