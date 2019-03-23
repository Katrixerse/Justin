const Discord = require('discord.js');
exports.run = async (client, message) => {
    try {
        if (message.mentions.users.size < 1) return message.channel.send("you can't fist-bump nobody")
        let user = message.guild.member(message.mentions.users.first());
        const embed = new Discord.RichEmbed()
          .setDescription(`${user} You were divorced with ${message.author.username} :broken_heart:`)
          .setImage('https://i.imgur.com/IgvLWaa.gif')
          .setColor(0x6B363E);
        return message.channel.send(embed);
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'roleplay'
};

exports.help = {
    name: 'divorce',
    description: 'Divorces the user.',
    usage: 'divorce @User'
};