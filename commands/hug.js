const request = require('node-superfetch');
const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    if (message.mentions.users.size < 1) return message.channel.send("you can't hug nobody")
    let user = message.mentions.users.first();
    try {
        const { body } = await request
            .get('https://nekos.life/api/hug')
            .set('Key', 'Your key')
        const roleplay_Embed = new Discord.RichEmbed()
            .setTitle(`${user.username} You got a hug from ${message.author.username} ❤`)
            .setImage(`${body.url}`)
        message.channel.send(roleplay_Embed)
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'roleplay'
};

exports.help = {
    name: 'hug',
    description: 'Give a user a hug.',
    usage: 'hug @User'
};