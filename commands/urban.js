const Discord = require("discord.js");
const request = require('node-superfetch');
const types = ['top'];
exports.run = async (client, message, args) => {
    const word = args.join(' ');
    if (!message.channel.nsfw) return message.channel.send("Cannot send NSFW content in a SFW channel.")
    try {
        const { body } = await request
            .get('http://api.urbandictionary.com/v0/define')
            .query({
                term: word
            });
        if (!body.list.length) return message.channel.send('Could not find any results.');
        const data = body.list[types === 'top' ? 0 : Math.floor(Math.random() * body.list.length)];
        const embed = new Discord.RichEmbed()
            .setColor(0x32A8F0)
            .setAuthor('Urban Dictionary', 'https://i.imgur.com/Fo0nRTe.png', 'https://www.urbandictionary.com/')
            .setURL(data.permalink)
            .setTitle(data.word)
            .setDescription((data.definition))
            .addField('Example', data.example);
        return message.channel.send(embed);
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'nsfw'
};

exports.help = {
    name: 'urban',
    description: 'Will get the definition for a word.',
    usage: 'urban [query]'
};