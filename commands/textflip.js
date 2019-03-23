const { letterTrans } = require('custom-translate');
const upsidedownchars = require('../assets/json/textflip.json');
exports.run = async (client, message, args) => {
    const text = args.join(' ');
    try {
        const converted = letterTrans(text, upsidedownchars);
        return message.channel.send(converted);
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
    name: 'textflip',
    description: 'Flips text ndsᴉpǝ poʍu.',
    usage: 'textflip'
};