const Discord = require('discord.js');
exports.run = async (client, message) => {
    try {
        let user = message.mentions.users.first() || message.author
        const embed = new Discord.RichEmbed()
              .setImage(user.displayAvatarURL)
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
    name: 'avatar',
    description: 'Sends the users avatar.',
    usage: 'avatar @User/username'
};