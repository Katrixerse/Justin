const fs = require('fs');
exports.run = (client, message, args) => {
    fs.readdir("./commands/", (err, files) => {
        const filez = files.length
        message.channel.send(`At this time Justin has: ${filez + 14} commands.`);
    })
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'fun'
};

exports.help = {
    name: 'command-count',
    description: 'Allows you to view the total commands the bot has.',
    usage: 'command-count'
};