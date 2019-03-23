const Discord = require("discord.js");
exports.run = async (client, message, args) => {
    let embed = new Discord.RichEmbed()
        .setImage("https://i.ytimg.com/vi/GD6qtc2_AQA/maxresdefault.jpg")
        .setColor(0x00A2E8)
    message.channel.send(embed);
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'fun'
};

exports.help = {
    name: 'muk',
    description: 'The more you know',
    usage: 'muk'
};