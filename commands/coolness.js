const coolness_responses = require('../assets/json/coolness.json')
exports.run = async (client, message, args) => {
    try {
        let user = message.mentions.users.first();
        if (message.mentions.users.size < 1) return message.reply('You must mention someone to determine their coolness.');
        const roasts = coolness_responses[Math.floor(Math.random() * coolness_responses.length)];
        const embed = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setDescription(`${user.username} is ${roasts}`);
        message.channel.send(embed)
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
    name: 'coolness',
    description: 'Determines the users coolness.',
    usage: 'coolness @User'
};