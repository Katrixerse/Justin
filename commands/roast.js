const Discord = require('discord.js');
const roast = require('../assets/json/roast.json')
exports.run = async (client, message) => {
    try {
        let user = message.mentions.users.first();
        if (message.mentions.users === message.author.username) return message.reply('You can not roast yourself');
        if (message.mentions.users.size < 1) return message.reply('You must mention someone to roast them.')
        const roasts = roast[Math.floor(Math.random() * roast.length)];
        const embed = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setDescription(user.username + ", " + roasts);
        message.channel.send({embed})
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'fun'
};

exports.help = {
    name: 'roast',
    description: 'Will roast someone.',
    usage: 'roast'
};