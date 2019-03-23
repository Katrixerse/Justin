const Discord = require('discord.js');
exports.run = async (client, message) => {
    try {
        if (message.mentions.users.size < 1) return message.channel.send("You can't tackle at nobody.")
        let user = message.guild.member(message.mentions.users.first());
        const embed = new Discord.RichEmbed()
          .setDescription(`${user} You got a tackle from ${message.author.username} ❤`)
          .setImage('http://gifimage.net/wp-content/uploads/2017/07/anime-tackle-hug-gif-12.gif')
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
    name: 'tackle',
    description: 'tackle the user.',
    usage: 'tackle'
};