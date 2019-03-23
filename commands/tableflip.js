exports.run = (client, message) => {
    return message.channel.send('(╯°□°）╯︵ ┻━┻');
};
  
exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
};
  
exports.help = {
    name: 'tableflip',
    description: 'tableflip. I wonder what this does? /sarcasm',
    usage: 'tableflip'
};