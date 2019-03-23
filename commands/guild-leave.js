exports.run = async (client, message, args) => {
    if (message.author.id !== "130515926117253122") return message.channel.send("Only bot owner can use this command")
    const code = args.join(' ');
    if (code < 1) {
        try {
            let guild = client.guilds.get(message.guild.id);
            if (!guild) return message.channel.send('Not a valid guild Id');
            message.channel.send('I have left the guild with ID: ' + message.guild.id);
            return guild.leave();
        } catch (err) {
            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    } else {
        try {
            let guild = client.guilds.get(code);
            if (!guild) return message.channel.send('Not a valid guild Id');
            message.channel.send('I have left the guild with ID: ' + code);
            return guild.leave();
        } catch (err) {
            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'owner'
};

exports.help = {
    name: 'guild-leave',
    description: 'Forces the bot to leave a guild.',
    usage: 'guild-leave'
};