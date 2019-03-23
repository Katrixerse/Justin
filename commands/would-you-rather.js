const Discord = require('discord.js');
const request = require('node-superfetch');;
exports.run = async (client, message) => {
    if (!message.guild.member(client.user).hasPermission('ADD_REACTIONS')) return message.reply('I need the ADD_REACTIONS permission to use this command.')
    try {
        const { body } = await request
            .get('http://www.rrrather.com/botapi');
        const embed = new Discord.RichEmbed()
            .setTitle(`${body.title} Choice A Or B?`)
            .setURL(body.link)
            .setColor(0x6B363E)
            .setDescription(`${body.choicea} OR ${body.choiceb}?`);
        message.channel.send(embed).then(m => {
            m.react('🅰');
            m.react('🅱');
        });
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: ['wur', 'w-u-r'],
    commandCategory: 'fun'
};

exports.help = {
    name: 'would-you-rather',
    description: 'Bot will ask would you rather questions.',
    usage: 'would-you-rather'
};