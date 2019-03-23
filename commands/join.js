exports.run = (client, message) => {
    return new Promise((resolve, reject) => {
        const voiceChannel = message.member.voiceChannel;
        if (voiceChannel && !voiceChannel.joinable) return message.channel.send("Can't join your voice channel.");
        if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
        const GuildCheck = client.guilds.get(message.guild.id)
        if (GuildCheck.voiceConnection !== 'null') {
            voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
        } else {
            return message.channel.send('Make sure the bot isn\'t already in a another voice channel.')
        }
    });
};
    
exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'music'
};
    
exports.help = {
    name: 'join',
    description: 'Bot will join the voice channel your currently in.',
    usage: 'join'
};