const Discord = require('discord.js');
const request = require('node-superfetch');
exports.run = async (client, message) => {
    try {
        const { body } = await request
            .get('http://aws.random.cat/meow');
        const embed = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setImage(body.file);
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
    name: 'cat',
    description: 'Sends a random cat picture.',
    usage: 'cat'
};