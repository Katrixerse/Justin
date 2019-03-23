exports.run = async (client, message, args) => {
    try {
        const word = args.join(' ');
        if (word < 1) return message.channel.send("Didn't provide any text to count");
        return message.channel.send(word.length);
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
    name: 'character-count',
    description: 'Responds with the character count of text.',
    usage: 'character-count'
};