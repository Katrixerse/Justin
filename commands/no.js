const Discord = require('discord.js');
exports.run = async (client, message) => {
    try {
        let embed = new Discord.RichEmbed()
            .setImage("https://media.giphy.com/media/12XMGIWtrHBl5e/giphy.gif")
            .setColor(0x6B363E);
        return message.channel.send(embed);
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'fun'
};

exports.help = {
    name: 'no',
    description: 'Please god nooooo.',
    usage: 'no'
};