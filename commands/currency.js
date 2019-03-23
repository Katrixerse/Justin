const request = require('node-superfetch');
exports.run = async (client, message, args) => {
    const base = args[0];
    const to = args[1];
    const amount = args[2]
    if (base === to) return message.channel.send(`Converting ${base} to ${to} is the same value, dummy.`);
    try {
        const { body } = await request
            .get('http://api.fixer.io/latest')
            .query({
                base,
                symbols: to
            });
        const tofixed = parseFloat(amount).toFixed(2)
        const tofixed2 = parseFloat(body.rates[to]).toFixed(2)
        message.channel.send(`$${tofixed} ${base} is $${tofixed * tofixed2} ${to}.`).catch(console.error);
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'currency',
    description: 'Converts currencys for you.',
    usage: 'currency [currecy1] [currency2] [amount]'
};