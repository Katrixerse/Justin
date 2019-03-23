exports.run = async (client, message) => {
    try {
        return message.channel.send('Stop it, get some help!')
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
    name: 'stop-it',
    description: 'Stop it, get some help.',
    usage: 'stop-it'
};