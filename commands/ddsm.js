const Discord = require("discord.js");
const request = require('node-superfetch');
exports.run = async (client, message) => {
    if (!message.channel.nsfw) return message.channel.send("Cannot send NSFW content in a SFW channel.")
    try {
        const { body } = await request
            .get('https://www.reddit.com/r/bdsm.json?sort=top&t=week')
            .query({
                limit: 800
            });
        const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if (!allowed.length) return message.channel.send('It seems we are out of fresh nsfw images!, Try again later.');
        const randomnumber = Math.floor(Math.random() * allowed.length)
        const embed = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setTitle(allowed[randomnumber].data.title)
            .setDescription("Posted by: " + allowed[randomnumber].data.author)
            .setImage(allowed[randomnumber].data.url)
            .setFooter("Images provided by r/bdsm")
        return message.channel.send(embed)
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
    name: 'bdsm',
    description: 'Gets a random image off of r/bdsm.',
    usage: 'bdsm'
};