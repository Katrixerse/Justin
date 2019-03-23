const Discord = require('discord.js');
exports.run = async (client, message, args) => {
      if (message.mentions.users.size < 1) return message.channel.send("you can't marry nobody");
      let user = message.guild.member(message.mentions.users.first());
      const roleplay_embed = new Discord.RichEmbed()
        .setDescription(`${user} You got married with ${message.author.username} ❤`)
        .setImage('https://i.imgur.com/u67QLhB.gif');
    message.channel.send(roleplay_embed);
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'roleplay'
};

exports.help = {
    name: 'marry',
    description: 'Marry a user.',
    usage: 'marry @User'
};
   
