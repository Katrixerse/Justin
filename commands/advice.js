const request = require('node-superfetch');
exports.run = async (client, message, args) => {
    try {
        const { text } = await request.get('http://api.adviceslip.com/advice');
        const body = JSON.parse(text);
        return msg.say(`${body.slip.advice} (#${body.slip.slip_id})`);
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'fun'
};

exports.help = {
    name: 'advice',
    description: 'Bots gives random advice.',
    usage: 'advice'
};