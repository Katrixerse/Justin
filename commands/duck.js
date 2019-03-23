const Discord = require('discord.js');
const request = require('node-superfetch');
exports.run = async (client, message) => {
    try {
        const { body } = await request
            .get('https://random-d.uk/api/v1/random');
        const embed = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setImage(body.url)
        return message.channel.send(embed)
    } catch (err) {
        return message.channel.send("An error happened while running this command " + err + ', please report this to the dev.')
    }
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'duck',
    description: 'Sends a random duck photo.',
    usage: 'duck'
};