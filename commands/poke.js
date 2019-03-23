const Discord = require('discord.js');
exports.run = async (client, message) => {
    try {
        if (message.mentions.users.size < 1) return message.channel.send("You can't poke nobody.")
        let user = message.guild.member(message.mentions.users.first());
        const embed = new Discord.RichEmbed()
          .setDescription(`${user} You got a poke from ${message.author.username}`)
          .setImage('https://i.imgur.com/XMuJ7K8.gif')
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
    name: 'poke',
    description: 'Pokes the user.',
    usage: 'poke'
};