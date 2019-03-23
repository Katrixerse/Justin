const Discord = require('discord.js');
const request = require('node-superfetch');;
exports.run = async (client, message, args) => {
    const query = args.join(' ')
    try {
        const { body } = await request
            .get('https://en.wikipedia.org/w/api.php')
            .query({
                action: 'query',
                prop: 'extracts',
                format: 'json',
                titles: query,
                exintro: '',
                explaintext: '',
                redirects: '',
                formatversion: 2
            });
        if (body.query.pages[0].missing) return message.channel.send('No Results.');
        const embed = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setTitle(body.query.pages[0].title)
            .setAuthor('Wikipedia', 'https://i.imgur.com/a4eeEhh.png')
            .setDescription(body.query.pages[0].extract.substr(0, 2000).replace(/[\n]/g, '\n\n'));
        return message.channel.send(embed)
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: ['wiki'],
    commandCategory: 'fun'
};

exports.help = {
    name: 'wikipedia',
    description: 'Searches wikipedia for you.',
    usage: 'wikipedia [query]'
};