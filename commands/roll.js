const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    try {
        const value = parseInt(args.join(' '));
        if (isNaN(value)) return message.channel.send("Not a valid number to roll")
        if (!isFinite(value)) return message.channel.send("Can not roll infinite")
        isFinite
        const roll = Math.floor(Math.random() * value) + 1;
        const embed = new Discord.RichEmbed()
            .addField("The dice rolled", roll)
            .setColor(0x6B363E)
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
    name: 'roll',
    description: 'Roll the dice.',
    usage: 'roll'
};