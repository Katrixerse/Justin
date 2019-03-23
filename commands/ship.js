const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    try {
        let user1 = message.mentions.users.first() || args[0];
        let user2 = message.mentions.users.last() || args.slice(1).join(' ');
        if (!user1) return message.channel.send("You did not select the first item to ship")
        if (!user2) return message.channel.send("You did not select the second item to ship")
        var ship = Math.floor(Math.random() * 100) + 1;
        if (ship <= 49) {
            const badmatch = new Discord.RichEmbed()
                .setColor(0x6B363E)
                .setDescription(user1 + " and " + user2 + " do not match very well.\n:broken_heart: " + ship + "% :broken_heart:")
            return message.channel.send(badmatch);
        } else if (ship === 100) {
            const perfectmatch = new Discord.RichEmbed()
                .setColor(0x6B363E)
                .setDescription(user1 + " and " + user2 + " are meant for eachother.\n:heart: " + ship + "% :heart:")
            return message.channel.send(perfectmatch);
        } else {
            const match = new Discord.RichEmbed()
                .setColor(0x6B363E)
                .setDescription(user1 + " and " + user2 + " match very well.\n:heart: " + ship + "% :heart:")
            return message.channel.send(match);
        }
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
    name: 'ship',
    description: 'Ship 2 users/items.',
    usage: 'ship'
};