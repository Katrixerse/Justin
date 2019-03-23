exports.run = async (client, message, args) => {
    try {
        const text = args.join(' ');
        const converted = text.split('').reverse().join('');
        return message.channel.send(`\u180E${converted}`);
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
    name: 'reverse',
    description: 'Will reverse any text.',
    usage: 'reverse'
};