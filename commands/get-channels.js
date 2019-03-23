exports.run = async (client, message) => {
    try {
        return message.channel.send(`Voice Channels: ${message.guild.channels.filter(chan => chan.type === 'voice').size} | Text Channels:  ${message.guild.channels.filter(chan => chan.type === 'text').size}`)
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
    name: 'get-channels',
    description: 'Get voice/text channel count!.',
    usage: 'get-channels'
};