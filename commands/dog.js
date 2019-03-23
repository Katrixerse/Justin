const Discord = require('discord.js');
const request = require('node-superfetch');
exports.run = async (client, message) => {
    try {
        const { body } = await request
            .get('https://random.dog/woof.json');
        const embed = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setImage(body.url)
        if (body.url.includes(".mp4")) return; // As mp4s cant really be set as a image for a embed and will cause a error in the console
        return message.channel.send(embed);
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
    name: 'dog',
    description: 'Sends a random dog photo.',
    usage: 'dog'
};