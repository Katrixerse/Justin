exports.run = (client, message) => {
    message.channel.send(`Jusin's support server: https://discord.gg/ZWA2rmR`);
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'main'
};

exports.help = {
    name: 'support',
    description: 'Sends you an invite for the support server.',
    usage: 'support'
};

