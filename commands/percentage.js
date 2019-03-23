exports.run = async (client, message, args) => {
    const amount = args[0]
    const maximum = args[1]
    const percentage = (amount / maximum) * 100;
    message.channel.send(`${amount} is ${percentage.toFixed(2)}% of ${maximum}.`);
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'percentage',
    description: 'Ask the 8ball anything and get your answer.',
    usage: 'percentage [amount] [maxnumber]'
};