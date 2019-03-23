const Discord = require('discord.js');
exports.run = (client, message) => {
    let embed = new Discord.RichEmbed()
        .setThumbnail("http://logok.org/wp-content/uploads/2014/05/Paypal-logo-pp-2014.png")
        .setDescription("Thank you for considering donating, the bots funding costs A LOT of money, so any bit of money would help our discord bot stay alive, thank you and bot on!")
        .setColor(0x6B363E)
        .addField("Paypal Email", "zachary_2000@live.com")
    message.channel.send(embed);
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'donate',
    description: 'Gives you a option if you choose to donate.',
    usage: 'donate'
};