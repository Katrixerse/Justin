const Discord = require('discord.js');
const request = require('node-superfetch');;
exports.run = async (client, message) => {
    try {
        const { body } = await request
            .get('https://nekos.life/api/neko');
        const embed = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setImage(body.neko)
        return message.channel.send(embed)
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
    name: 'weeb',
    description: 'Sends a random anime photo.',
    usage: 'weeb'
};