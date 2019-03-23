const Discord = require('discord.js');
const { promisifyAll } = require('tsubaki');
const xml = promisifyAll(require('xml2js'));
exports.run = async (client, message, args) => {
    if (!message.channel.nsfw) return message.channel.send("Cannot send NSFW content in a SFW channel.")
    const query = args.join('_');
    if (query < 1) {
        try {
            const { body } = await request
                .get('https://www.reddit.com/r/rule34.json?sort=top&t=week')
                .query({
                    limit: 800
                });
            const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
            if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
            const randomnumber = Math.floor(Math.random() * allowed.length)
            const embed = new Discord.RichEmbed()
                .setColor(0x6B363E)
                .setTitle(allowed[randomnumber].data.title)
                .setDescription("Posted by: " + allowed[randomnumber].data.author)
                .setImage(allowed[randomnumber].data.url)
                .setFooter("Images provided by r/rule34")
            return message.channel.send(embed)
        } catch (err) {
            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    } else {
        try {
            const { text } = await request
                .get('https://rule34.xxx/index.php')
                .query({
                    page: 'dapi',
                    s: 'post',
                    q: 'index',
                    tags: query,
                    limit: 1
                });
            const { posts } = await xml.parseStringAsync(text);
            if (posts.$.count === '0') return message.channel.send('No Results found for ' + query + '.');
            const embed = new Discord.RichEmbed()
                .setTitle("Results for " + query)
                .setImage(posts.post[0].$.file_url)
            return message.channel.send(embed)
        } catch (err) {
            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
};

exports.conf = {
    guildOnly: false,
    aliases: ['r34'],
    commandCategory: 'nsfw'
};

exports.help = {
    name: 'rule34',
    description: 'Gets a random/searched rule34 image.',
    usage: 'rule34 [query]'
};