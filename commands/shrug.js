exports.run = (client, message) => {
    return message.channel.send("¯\\_(ツ)_/¯");
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'shrug',
    description: 'shrug. I wonder what this does? /sarcasm',
    usage: 'shrug'
};