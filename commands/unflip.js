exports.run = async (client, message) => {
    try {
        return message.channel.send('┬─┬ ノ( ゜-゜ノ)')
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
    name: 'unflip',
    description: 'Unflips the table.',
    usage: 'unflip'
};