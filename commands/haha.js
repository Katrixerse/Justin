const Discord = require('discord.js')
exports.run = async (client, message) => {
    try {
        let embed = new Discord.RichEmbed()
            .setImage("https://vgy.me/XPmGT9.gif")
            .setColor(0x6B363E)
        return message.channel.send({embed});
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'haha',
    description: 'Haha!.',
    usage: 'haha'
};