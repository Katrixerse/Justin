const Discord = require('discord.js');
exports.run = async (client, message) => {
    try {
        if (message.mentions.users.size < 1) return message.channel.send("You can't wave at nobody.")
        let user = message.guild.member(message.mentions.users.first());
        const embed = new Discord.RichEmbed()
          .setDescription(`${message.author.username} waves at ${user} :wave:`)
          .setImage('https://vgy.me/gU0E4c.gif')
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
    name: 'wave',
    description: 'Wave at the user.',
    usage: 'wave'
};