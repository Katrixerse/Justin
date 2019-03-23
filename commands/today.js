const request = require('node-superfetch');
const Discord = require('discord.js')
exports.run = async (client, message, args) => {
    let month = args[0];
    let day = args.slice(1).join('');
    const date = month && day ? `/${month}/${day}` : '';
    try {
        const { text } = await request.get(`http://history.muffinlabs.com/date${date}`);
        const body = JSON.parse(text);
        const events = body.data.Events;
        const event = events[Math.floor(Math.random() * events.length)];
        const embed = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setURL(body.url)
            .setTitle(`Today: (${body.date})...`)
            .setDescription(`${event.year}: ${event.text}`)
            .addField('See More', event.links.map(link => `[${link.title}](${link.link.replace(/\)/g, '%29')})`).join('\n'));
        return message.channel.send(embed);
    } catch (err) {
        if (err.status === 404 || err.status === 500) return msg.say('Invalid date.');
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'today',
    description: 'Allows owners to make the bot commands respond to users with KICK_MEMEBERS perm or have been added using j!addmod.',
    usage: 'today'
};