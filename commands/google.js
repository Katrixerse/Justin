const Discord = require("discord.js");
const got = require('got');
const cheerio = require('cheerio');
   const QUERY_STRING_SETTINGS = [
    'client=chrome',
    'rls=en',
    'ie=UTF-8',
    'oe=UTF-8'
].join('&');

function getText(children) {
    if (children.children) return getText(children.children);
    return children.map(c => {
        return c.children ? getText(c.children) : c.data;
    }).join('');
}
exports.run = async (client, message, args) => {

  if (args.length < 1) {
        message.channel.send('You must enter something to search for!');
    }

    const res = await got(`https://google.com/search?${QUERY_STRING_SETTINGS}&q=${encodeURIComponent(args.join(' '))}`);
    if (res.statusCode !== 200) {
        return message.channel.send(`Error! (${res.statusCode}): ${res.statusMessage}`);
    }

    let $ = cheerio.load(res.body);
    let results = [];

    $('.g').each((i) => {
        results[i] = {};
    });

    $('.g>.r>a').each((i, e) => {
        let raw = e.attribs['href'];
        results[i]['link'] = decodeURIComponent(raw.substr(7, raw.indexOf('&sa=U') - 7));
    });

    $('.g>.s>.st').each((i, e) => {
        results[i]['description'] = getText(e);
    });

    try {
    let output = results.filter(r => r.link && r.description)
        .slice(0, 3)
        .map(r => `${r.link}\n\t${r.description}\n`)
        .join('\n');
        if (output.length < 1) return message.channel.send("No results for " + args.join(' '))
        const filtercheck = ["xxx", "porn", "sex", "18+", "nsfw", "hentai", "dick", "vagina", "nude", "pussy", "cum", "creampie"]
        if (filtercheck.some(word2 => output.toLowerCase().includes(word2))) return message.channel.send("Not allowed to google nsfw content.");

        const embed = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setTitle(`Search results for ${args.join(' ')}`)
            .setDescription(output)
        return message.channel.send({embed})
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'main'
};

exports.help = {
    name: 'google',
    description: 'Use the all mighty google to find your answer.',
    usage: 'google'
};