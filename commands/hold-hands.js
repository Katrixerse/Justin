const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    if (message.mentions.users.size < 1) return message.channel.send("you can't hold hands with nobody.");
    let user = message.guild.member(message.mentions.users.first());
        const embed = new Discord.RichEmbed()
            .setDescription(`${user} You held hands with ${message.author.username} ❤`)
            .setImage('https://media.giphy.com/media/TnUJHKyjwHXOM/giphy.gif');
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
 

 
