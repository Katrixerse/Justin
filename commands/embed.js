const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    try {
        const word = args.join(' ')
        if (word < 1) return message.channel.send("Didn't provide any text to embed")
        if (word.length > 2047) return message.channel.send("Can't embed for than 2047 characters")
        const embed = new Discord.RichEmbed()
          .setDescription(word)
          .setColor(0x6B363E);
        return message.channel.send({embed});
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
    name: 'embed',
    description: 'Takes the text you give and put it in a embed.',
    usage: 'embed [text]'
};