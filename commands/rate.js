const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    try {
        const rating = Math.floor(Math.random() * 11);
        return message.channel.send("I rate it a " + rating + "\10")
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
    name: 'rate',
    description: 'Will rate something.',
    usage: 'rate'
};