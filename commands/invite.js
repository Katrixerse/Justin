exports.run = (client, message) => {
    message.channel.send(`Can invite the bot with this link: https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=506850678`);
};
  
exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
  };
  
exports.help = {
    name: 'invite',
    description: 'Gives you an invite for the bot.',
    usage: 'invite'
  };