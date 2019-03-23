const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    try {
        const sexyrate = Math.floor(Math.random() * 100)
        const embed = new Discord.RichEmbed()
            .addField(":heart_decoration: Sexy Rate :heart_decoration: ", "I rate you a " + sexyrate + " out of 100 on the sexy scale")
            .setThumbnail(message.author.displayAvatarURL)
        return message.channel.send(embed)
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
    name: 'sexy-rate',
    description: 'Rates your sexyness.',
    usage: 'sexy-rate'
};