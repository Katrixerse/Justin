const Discord = require('discord.js');
exports.run = (client, message, args) => {
    try {
        const choice1 = args[0];
        const choice2 = args.slice(1).join(" ");
        if (choice2 < 1) return message.channel.send("Didnt provide a second option to choose from.");
        var choices = [`${choice1}`, `${choice2}`];
        return message.channel.send(`I choose ${choices[Math.floor(Math.random() * choices.length)]}!`);
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
    name: 'choose',
    description: 'Bot will pick from two user/options.',
    usage: 'choose @User1/option @User2/option2'
};