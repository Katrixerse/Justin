const request = require('node-superfetch');
const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    if (message.mentions.users.size < 1) return message.channel.send("you can't hug nobody")
    let user = message.mentions.users.first();
    try {
        const { body } = await request
            .get('https://nekos.life/api/kiss')
            .set('Key', 'Your key')
        const roleplay_Embed = new Discord.RichEmbed()
            .setTitle(`${user.username} You got a kiss from ${message.author.username} ❤`)
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
    name: 'kiss',
    description: 'Give a user a kiss.',
    usage: 'kiss @User'
};