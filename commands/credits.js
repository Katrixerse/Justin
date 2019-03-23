const Discord = require('discord.js');
exports.run = (client, message) => {
    try {
        const embed = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setTitle("Developer: Syntheti#9715")
            .setDescription('Special Thanks to the following people\nandrew#2270 - Helped with afk/manage commands/categories systems.\nChaoticDestruction#9748 - Helps manage everything thats not coding related.\nReztierk - Helps with sql/db.\nHelp from the follwing made this bot possible.')
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
    name: 'credits',
    description: 'Will tell you who made/contributed to the bot.',
    usage: 'credits'
};