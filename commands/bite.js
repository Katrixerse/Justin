const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    if (message.mentions.users.size < 1) return message.channel.send("you can't bite nobody")
    let user = message.guild.member(message.mentions.users.first());
        const embed = new Discord.RichEmbed()
            .setDescription(`${user} You were bitten by ${message.author.username}.`)
            .setImage('https://vgy.me/n0csgJ.gif');
        message.channel.send(embed);
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'roleplay'
};

exports.help = {
    name: 'bite',
    description: 'Give a user a bite.',
    usage: 'bite @User'
};
 
