const Discord = require("discord.js");
exports.run = (client, message, args) => {
    if (message.author.id !== "130515926117253122") return message.channel.send("Only bot owner can use this command")
    var m = "";
    client.guilds.forEach(function (e) {
        m += "\n" + e
    });
    message.channel.send(m, {
        split: true
    })
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'owner'
};

exports.help = {
    name: 'bot-servers',
    description: 'Tells you the servers the bots in.',
    usage: 'bot-servers'
};