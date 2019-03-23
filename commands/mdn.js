const Discord = require("discord.js");
const request = require('node-superfetch');
exports.run = async (client, message, args) => {
    const query = args.join(' ')
    try {
        const { body } = await request
            .get('https://developer.mozilla.org/en-US/search.json')
            .query({
                q: query,
                locale: 'en-US',
                highlight: false
            });
        if (!body.documents.length) return message.channel.send('Could not find any results.');
        const data = body.documents[0];
        const embed = new Discord.RichEmbed()
            .setColor(0x066FAD)
            .setAuthor('MDN', 'https://i.imgur.com/DFGXabG.png', 'https://developer.mozilla.org/')
            .setURL(data.url)
            .setTitle(data.title)
            .setDescription(data.excerpt);
        return message.channel.send(embed);
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
}
   
exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'mdn',
    description: 'Gives you info off of mdn.',
    usage: 'mdn'
};