const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD", false, true, true)) return message.channel.send("Need MANAGE_GUILD permission to use this command.")
    const usersnewrank = args.join(' ')
    const fixusersnewrank = usersnewrank.replace(/[^\x00-\x7F]/g, "");
    if (usersnewrank < 1) return message.channel.send("Didnt provide any rank to give.");
    if (usersnewrank.length >= 10) return message.channel.send("Rank names can't be over 10 characters.")
    if (fixusersnewrank < 1) return message.channel.send("Invalid characters in the rank.")
    if (fixusersnewrank.length >= 10) return message.channel.send("Rank names can't be over 10 characters.")
            if (message.mentions.users.size < 1) {
                sql.get(`SELECT rank FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row2 => {
                    if (!row2) message.channel.send("You needs to start talking first.")
                    sql.run(`UPDATE user_profiles SET rank = "${fixusersnewrank}" WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    message.channel.send("I have changed: " + message.author.username + " rank to " + fixusersnewrank);
                })
            } else {
                const user = message.mentions.users.first();
                sql.get(`SELECT rank FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`).then(row => {
                    if (!row) message.channel.send("User needs to start talking first.")
                    sql.run(`UPDATE user_profiles SET rank = "${fixusersnewrank}" WHERE guildId ="${message.guild.id}" AND userId = ${user.id}`);
                    message.channel.send("I have changed: " + user.username + " rank to " + fixusersnewrank);
                })
        }
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'leveling'
};

exports.help = {
    name: 'edit-rank',
    description: 'Edit the rank the user. [Profiles]',
    usage: 'edit-rank @User'
};