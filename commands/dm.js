const Discord = require('discord.js');
exports.run = async (client, message) => {
    try {
        if (!message.member.hasPermission("KICK_MEMBERS", false, true, true)) return message.channel.send(`Missing permissions to dm this user with the bot.`)
        try {
            let who = message.mentions.users.first()
            if (message.mentions.users.size < 1) return message.channel.send(usage);
            if (message.author.id == who.id) return message.channel.send(`:x: Well no you can't dm yourself.`);
            message2 = args.slice(1).join(` `);
            if (message2 >= 400) return message.channel.send(usage)
            who.send('**Message from ' + message.author.username + '**: ' + message2)
            return message.channel.send(`Sucessfully sent message to ${who.username}.`)
        } catch (err) {
            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'roleplay'
};

exports.help = {
    name: 'dm',
    description: 'Divorces the user.',
    usage: 'dm @User'
};