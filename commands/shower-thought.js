const Discord = require('discord.js');
const request = require('node-superfetch');
exports.run = async (client, message) => {
    try {
        const { body } = await request
            .get('https://www.reddit.com/r/Showerthoughts.json')
            .query({
                limit: 1000
            });
        const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if (!allowed.length) return message.channel.send('It seems the shower thoughts are gone right now. Try again later!');
        return message.channel.send(allowed[Math.floor(Math.random() * allowed.length)].data.title);
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
    name: 'shower-thought',
    description: 'Sends you a random shower thought from r/showerthoughts.',
    usage: 'shower-thought'
};