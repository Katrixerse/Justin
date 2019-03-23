const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    exports.run = (client, message, args) => {
        if (message.guild.owner.id === message.author.id) {
            sql.get(`SELECT mod_logs_channel FROM guild_moderation_settings WHERE guildId ="${message.guild.id}"`).then(row => {
                let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                const storechannel = row.mod_logs_channel
                modlog.delete()
                message.guild.createChannel(storechannel, 'text' [{
                    id: message.guild.id,
                    deny: ['READ_MESSAGES'],
                    deny: ['SEND_MESSAGES']
                }]).catch(console.error);
            })
        } else {
            message.channel.send("You need to be the guild owner to use this command.")
        }
    }
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'clean-modlog',
    description: 'Allows the guild owner to clear all messages out of the mod logs.',
    usage: 'clean-modlog '
};