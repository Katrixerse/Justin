const Discord = require("discord.js");
const request = require('node-superfetch');
exports.run = async (client, message, args) => {
	try {
        const { body } = await request
            .get('https://www.reddit.com/r/Aww.json?sort=top&t=week')
            .query({ limit: 800 });
        const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
        const randomnumber = Math.floor(Math.random() * allowed.length);
        const embed = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setTitle(allowed[randomnumber].data.title)
            .setDescription("Posted by: " + allowed[randomnumber].data.author)
            .setImage(allowed[randomnumber].data.url)
            .setFooter("Images provided by r/Aww");
        return message.channel.send(embed);
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'fun'
};

exports.help = {
    name: 'aww',
    description: 'Sends the user a random picture from r/aww.',
    usage: 'aww'
};
   
