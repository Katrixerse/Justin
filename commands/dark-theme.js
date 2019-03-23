exports.run = async (client, message) => {
    try {
        return message.channel.send({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'dark-light', `dark-light.png`)] })
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
    name: 'dark-theme',
    description: 'Better use dark-theme.',
    usage: 'dark-theme'
};