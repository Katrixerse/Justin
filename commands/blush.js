const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    if (message.mentions.users.size < 1) return message.channel.send("you can't blush at nobody.")
    let user = message.guild.member(message.mentions.users.first());
        const embed = new Discord.RichEmbed()
            .setDescription(`${message.author.username} blushes at ${user}.`)
            .setImage('https://vgy.me/Db8WXj.gif');
        message.channel.send(embed);
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'roleplay'
};

exports.help = {
    name: 'blush',
    description: 'Give a user a blush.',
    usage: 'blush @User'
};
 
