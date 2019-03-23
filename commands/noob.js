const Discord = require("discord.js");
exports.run = async (client, message, args) => {
  let embed = new Discord.RichEmbed()
    .setImage("https://media.giphy.com/media/WyrdDeIxGOlQA/giphy.gif")
    .setColor(0x00A2E8);
  message.channel.send(embed);
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'fun'
};

exports.help = {
    name: 'noob',
    description: 'Sends a image what a noob.',
    usage: 'noob @User'
};
