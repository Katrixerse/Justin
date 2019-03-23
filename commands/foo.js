exports.run = async (client, message) => {
    try {
        return message.reply(" Bar!")
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'foo',
    description: 'Bar!.',
    usage: 'foo'
};