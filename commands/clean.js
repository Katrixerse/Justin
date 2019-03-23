exports.run = (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send("Sorry, you do not have permission to perform the clean command.");
    let num = (!!args.slice(0).join(' ')) ? parseInt(args.slice(0).join(' ')) || 99 : 99;
    message.channel.fetchMessages({limit: num}).then(messages => {
        let ms = messages.filter(m => m.author.id === client.user.id);
        if (ms.size === 1) {
            ms.first().delete();
            return message.channel.send("**Justin messages have been deleted**");
        }
        if (ms.size < 1) return message.channel.send("**No messages found to clean**");
        message.channel.bulkDelete(ms, true).then(() => message.channel.send("**Justin messages have been deleted**"));
    })
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'clean',
    description: 'Cleanup the bot responses.',
    usage: 'clean [amount]'
};