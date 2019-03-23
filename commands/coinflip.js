exports.run = (client, message, args) => {
    var coinflip = ['Heads!','Tails!'];
    message.channel.send(coinflip[Math.floor(Math.random () * coinflip.length)]);
}
 
exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'fun'
};

exports.help = {
    name: 'coinflip',
    description: 'Flips a coin.',
    usage: 'coinflip'
};