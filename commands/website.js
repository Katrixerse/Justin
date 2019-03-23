exports.run = (client, message) => {
    message.channel.send('https://www.justin.katrixerse.com/')
};
    
exports.conf = {
    guildOnly: false,
    aliases: ['web'],
    commandCategory: 'main'
};
    
exports.help = {
    name: 'website',
    description: 'Sends you the offical website for the bot',
    usage: 'website'
};