exports.run = async (client, message, args) => {
    message.channel.send("¯\_(ツ)_/¯");
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'fun'
};

exports.help = {
    name: 'disabledshrug',
    description: 'Sends a disabled shrug.',
    usage: 'disabledshrug'
};