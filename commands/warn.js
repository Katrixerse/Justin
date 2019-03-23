const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = async (client, message, args, mod_roles) => {
    if (!message.member.hasPermission("KICK_MEMBERS", false, true, true) && !message.member.roles.map((e) => e).join(',').toString().includes(mod_roles)) return message.reply('Sorry, you\'re missing the required permission to use this command, need KICK_MEMBERS. :x:');
    let reason = args.slice(1).join(' ') || `Moderator didn't give a reason.`;
    if (reason.length > 100) return message.channel.send(`Reasons cant be longer then 100 characters`)
    let user2 = message.mentions.users.first();
    if (message.mentions.users.size < 1) return message.channel.send(usage)
    /*sql.get(`SELECT * FROM punishmentshistory WHERE guildId = "${message.guild.id}" AND userId = "${user.user.id}"`).then(row1 => {
    if (row1.punishments === "none") {
            sql.run(`UPDATE punishmentshistory SET warns = ${row1.warns + 1}, punishments = "Case: #${row.casenumber} - warn - ${reason} \n" WHERE guildId = ${message.guild.id} AND userId = ${user.user.id}`);
        } else {
            sql.run(`UPDATE punishmentshistory SET warns = ${row1.warns + 1}, punishments = "${row1.punishments} Case: #${row.casenumber} - warn - ${reason} \n" WHERE guildId = ${message.guild.id} AND userId = ${user.user.id}`);
        }
    })*/
    sql.get(`SELECT * FROM guild_warning_system WHERE guildId ="${message.guild.id}" AND userId ="${user2.id}"`).then(row => {
        if (!row) {
            sql.run("INSERT INTO guild_warning_system (guildId, userId, userwarnings, reasons) VALUES (?, ?, ?, ?)", [message.guild.id, user2.id, 2, `1. ${reason} by: ${message.author.tag} on: ${message.createdAt.toDateString()}`]);
        }
    }).catch(() => {
        sql.run("CREATE TABLE IF NOT EXISTS guild_warning_system (guildId TEXT, userId TEXT, userwarnings INTEGER, reasons TEXT)").then(() => {
            sql.run("INSERT INTO guild_warning_system (guildId, userId, userwarnings, reasons) VALUES (?, ?, ?, ?)", [message.guild.id, user2.id, 2, `1. ${reason} by: ${message.author.tag} on: ${message.createdAt.toDateString()}`]);
        })
    })
    if (message.mentions.users.size < 1) return message.channel.send("Did not mention a user to warn them!")
    let user = message.guild.member(message.mentions.users.first())
    if (user.highestRole.position >= message.member.highestRole.position) return message.reply('I cant warn that member. They are the same level as you or higher. :x:')
    let user3 = message.mentions.users.first();
    let reason2 = args.slice(1).join(' ') || `Moderator didn't give a reason.`;
    if (reason2.length > 100) return message.channel.send("Reason must be under 100 characters.");
    message.channel.send("***" + user3.username + " has been successfully warned! :white_check_mark:***")
    user3.send("You have recieved a warning from: " + message.author.username + " for: " + reason2)
    sql.get(`SELECT * FROM guild_warning_system WHERE guildId ="${message.guild.id}" AND userId ="${user3.id}"`).then(row => {
        if (row.userwarnings >= 99) return message.channel.send("Have hit the max giveable warnings for this user, please use >clearwarns @Someone to remove their warnings.")
        sql.run(`UPDATE guild_warning_system SET user_warnings = ${row.userwarnings + 1}, reasons = "${row.reasons} \n${row.userwarnings}. ${reason2} by: ${message.author.tag} on: ${message.createdAt.toDateString()}" WHERE guildId = ${message.guild.id} AND userId = ${user3.id}`);
    })
    sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
        sql.run(`UPDATE scores SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
        let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
        ('name', row.logschannel)
        let reason3 = args.slice(1).join(' ');
        const embed = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setTitle("Case #" + row.casenumber + " | Action: Warn")
            .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
            .addField("User", user3.tag + " (ID: " + user3.id + ")")
            .addField("Reason", reason3, true)
            .setFooter("Time used: " + message.createdAt.toDateString())
        /*sql.get(`SELECT * FROM punishmentshistory WHERE guildId = "${message.guild.id}" AND userId = "${user.user.id}"`).then(row1 => {
            if (row1.punishments === "none") {
                    sql.run(`UPDATE punishmentshistory SET warns = ${row1.warns + 1}, punishments = "Case: #${row.casenumber} - warn - ${reason} \n" WHERE guildId = ${message.guild.id} AND userId = ${user.user.id}`);
                } else {
                    sql.run(`UPDATE punishmentshistory SET warns = ${row1.warns + 1}, punishments = "${row1.punishments} Case: #${row.casenumber} - warn - ${reason} \n" WHERE guildId = ${message.guild.id} AND userId = ${user.user.id}`);
                }
            })*/
        if (!modlog) return;
        if (row.logsenabled === "disabled") return;
        client.channels.get(modlog.id).send({
            embed
        });
    })
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'warn',
    description: 'Allows you to store notes with the bot.',
    usage: 'warn @User [reason]'
};