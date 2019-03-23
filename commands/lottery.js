exports.run = (client, message, args) => {
    let choices = args.join(' ')
    const prizes = ['0', '100', '250', '500', '1000', '5000', '10000', '20000', '50000'];
    const lotto = Array.from({ length: 6 }, () => Math.floor(Math.random() * 70) + 1);
    const similarities = lotto.filter((num, i) => choices[i] === num).length;
    return msg.channel.send(`${lotto.join(', ')} You matched **${similarities}** numbers, which gives you **${prizes[similarities]}**! Congrats!`);
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'economy'
};

exports.help = {
    name: 'lottery',
    description: 'Allows you to bet money and play blackjack against the bot.',
    usage: 'lottery [bet]'
};