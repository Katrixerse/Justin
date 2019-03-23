const Discord = require('discord.js');
const request = require('node-superfetch');
const config = require('../assets/json/config.json')
exports.run = async (client, message, args) => {
    const query = args.join(' ');
    try {
        const { body } = await request
            .get('https://www.googleapis.com/youtube/v3/search')
            .query({
                part: 'snippet',
                type: 'video',
                maxResults: 1,
                q: query,
                safeSearch: 'strict',
                key: `${config.Google_API_Key}`
            });
        if (!body.items.length) return message.channel.send('No results found for ' + query + ".");
        const embed = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setTitle(body.items[0].snippet.title)
            .setDescription(body.items[0].snippet.description)
            .setAuthor(`YouTube - ${body.items[0].snippet.channelTitle}`, 'https://i.imgur.com/hkUafwu.png')
            .setURL(`https://www.youtube.com/watch?v=${body.items[0].id.videoId}`)
            .setThumbnail(body.items[0].snippet.thumbnails.default.url);
        const filtercheck = ["xxx", "porn", "sex", "18+", "nsfw", "hentai", "dick", "vagina", "nude", "pussy", "cum", "creampie"]
        if (filtercheck.some(word2 => body.items[0].snippet.title.toLowerCase().includes(word2))) return message.channel.send("Not allowed to search nsfw content.");
        if (filtercheck.some(word3 => body.items[0].snippet.description.toLowerCase().includes(word3))) return message.channel.send("Not allowed to google search nsfw content.");
        message.channel.send(embed)
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: ['yt'],
    commandCategory: 'search'
};

exports.help = {
    name: 'youtube',
    description: 'Search on youtube.',
    usage: 'youtube'
};