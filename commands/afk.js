const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    let why = args.join(` `);
    if (why < 1) return message.channel.send(`Please provide the reason why you want to go AFK.`);
    if (why.length > 50) return message.channel.send(`AFK reason may not be longer than 50 characters.`);
    sql.get(`SELECT * FROM user_afk WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
        if (!row) {
            sql.run(`INSERT INTO user_afk (guildId, userId, isAfk, whyisAfk) VALUES (?, ?, ?, ?)`, [message.guild.id, message.author.id, 'yes', `${why}`]);
        } else {
            sql.run(`UPDATE user_afk SET isAfk = "yes", whyisAfk = "${why}" WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
        }
    }).catch(() => {
        sql.run(`CREATE TABLE IF NOT EXISTS user_afk (guildId TEXT, userId TEXT, isAfk TEXT, whyisAfk TEXT)`).then(() => {
            sql.run(`INSERT INTO user_afk (guildId, userId, isAfk, whyisAfk) VALUES (?, ?, ?, ?)`, [message.guild.id, message.author.id, `yes`, `${why}`]);
        });
    });
    if (message.member.roles.size > 0 && message.member.highestRole.position < message.guild.me.highestRole.position) {
        if (!message.guild.member(client.user).hasPermission('MANAGE_NICKNAMES')) return;
        if (message.member.highestRole.position >= message.guild.member(client.user).highestRole.position) return message.reply(`Can't changle your name for afk, roles thay are the same level as me or higher. :x:`);
        message.member.setNickname(`[AFK] ${message.member.displayName}`);
    }
    message.channel.send(`You are now AFK.`);
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'afk',
    description: 'Allows a message when mention to say why your afk.',
    usage: 'afk [reason]'
};