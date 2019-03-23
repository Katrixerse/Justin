const Discord = require('discord.js');
exports.run = (client, message, args) => {
    if (message.author.id != '130515926117253122') return message.channel.send('This command can **ONLY** be used by the owner of the bot.');
    const helpembed = new Discord.RichEmbed()
        .setColor(0x6B363E)
        .addField('Which setting would you like to change?', '\n[1] - Bots game\n[2] - Bots status\n# Type the number to use the option.\n# Type exit to leave this menu.')
    message.channel.send(helpembed)
        .then(() => {
            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                })
                .then((resp) => {
                    if (!resp) return;
                    resp = resp.array()[0];
                    if (resp.content === '1') {
                        message.channel.send('What would you like the game to be set too master?.')
                            .then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 30000,
                                        errors: ['time'],
                                    })
                                    .then((resp) => {
                                        if (!resp) return;
                                        resp = resp.array()[0];
                                        if (!resp.content) resp.content = null;
                                        client.user.setActivity(resp.content);
                                        message.reply(`The new game has been set too ${resp.content}!`);
                                    })
                            })
                    } else if (resp.content === '2') {
                        message.channel.send('What would you like my status to be set too master?.')
                            .then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 30000,
                                        errors: ['time'],
                                    })
                                    .then((resp) => {
                                        if (!resp) return;
                                        resp = resp.array()[0];
                                        if (resp.content === 'dnd' || resp.content === 'offline' || resp.content === 'online' || resp.content === 'idle') {
                                            client.user.setStatus(resp.content);
                                            return message.reply(`The new status has been set too ${resp.content}!`);
                                        } else {
                                            return message.channel.send("Can only pick dnd, offline, online and idle as options, try again.");
                                        }
                                    })
                            })
                    } else if (resp.content === 'exit') {
                        message.channel.send('Command has been canceled.')
                    } else {
                        message.channel.send(`${resp.content} was not a valid option.`)
                    }
                })
        })
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'owner'
  };
  
  exports.help = {
    name: 'bot-settings',
    description: 'Allows my master to change some settings.',
    usage: 'bot-settings [option]'
  };