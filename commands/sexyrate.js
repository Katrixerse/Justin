const Discord = require("discord.js");
exports.run = (client, message, args) => {
    const sexyrate = Math.floor(Math.random() * 100)
       const embed = new Discord.RichEmbed()
            .addField(`:heart_decoration: Sexy Rate :heart_decoration: ", "I rate you a ${sexyrate} out of 100 on the sexy scale.`)
            .setThumbnail(message.author.displayAvatarURL);
       message.channel.send(embed);
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'fun'
};

exports.help = {
    name: 'sexyrate',
    description: 'Rate a users sexyness.',
    usage: 'sexyrate @User'
};