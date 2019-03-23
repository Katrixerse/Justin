const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    sql.get(`SELECT leave_message FROM guild_wl_system WHERE guildId ="${message.guild.id}"`).then(row => {
    if (message.member.hasPermission("MANAGE_GUILD", false, true, true)) {
        let WelcomeMess = row.leave_message;
                var WelcomeFix = WelcomeMess.replace("%MENTION%", "<@" + message.author.id + ">").replace("%GUILDNAME%", message.guild.name).replace("%NAME%", message.author.username).replace("%MEMBERCOUNT%", message.guild.memberCount)
                message.channel.send(WelcomeFix)
    }
  })
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'leave-test',
    description: 'Allows you to see how the leave message looks.',
    usage: 'leave-test'
};