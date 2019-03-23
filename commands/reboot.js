exports.run = (client, message) => {
    message.channel.send("Bot will now reboot");
    client.com
    client.commands.forEach( async cmd => {
        await client.unloadCommand(cmd);
      });
    process.exit(1);
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'owner'
};

exports.help = {
    name: 'reboot',
    description: 'Using this command will reboot the bot [Bot owner command]',
    usage: 'reboot'
};