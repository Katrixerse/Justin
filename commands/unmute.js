const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args, mod_roles) => {
    if (!message.member.hasPermission("KICK_MEMBERS", false, true, true) && !message.member.roles.map((e) => e).join(',').toString().includes(mod_roles)) return message.reply('Sorry, you\'re missing the required permission to run this command, need KICK_MEMBERS. :x:');
    sql.get(`SELECT gp.prefix, gz.casenumber, gz.mod_logs_enabled, gz.mod_logs_channel, gh.mute_role FROM guild_prefix as gp left join guild_moderation_settings as gz on gp.guildId = gz.guildId left join guild_misc_settings as gh on gp.guildId = gh.guildId WHERE gp.guildId = '${message.guild.id}'`).then(row => {
        const prefixtouse = row.prefix
        const usage = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setThumbnail(client.user.avatarURL)
            .setTitle("Command: " + prefixtouse + "unmute")
            .addField("Usage", prefixtouse + "unmute @Someone <reason>")
            .addField("Example", prefixtouse + "unmute @Someone muted time is over.")
            .setDescription("Description: " + "Removes a user from the muted role");

            if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) return message.reply('Sorry, i dont have the perms to do this cmd i need MANAGE_ROLES. :x:')
            if (message.mentions.users.size < 1) return message.channel.send("You did not mention a user to unmute");
            let user = message.guild.member(message.mentions.users.first());
            if (user.highestRole.position >= message.member.highestRole.position) return message.reply('I cant unmute that member. they are the same level as you or higher. :x:');
            let reason = args.slice(1).join(' ') || `Moderator didn't give a reason.`;
            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
            let muteRole = client.guilds.get(message.guild.id).roles.find(role => role.name == row.mute_role);
            if (!muteRole) return message.reply('I cant find a Muted role :x:')
            if (reason.length < 1) return;

            if (message.guild.member(user).roles.has(muteRole.id)) {
                message.guild.member(user).removeRole(muteRole).then(() => {
                    sql.run(`UPDATE guild_moderation_settings SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
                    if (!modlog) return;

                    const embed = new Discord.RichEmbed()
                        .setColor(0x6B363E)
                        .setTitle("Case #" + row.casenumber + " | Action: Un-mute")
                        .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                        .addField("User", user.user.tag + " (ID: " + user.user.id + ")")
                        .addField("Reason", reason, true)
                        .setFooter("Time used: " + message.createdAt.toDateString())

                    client.channels.get(modlog.id).send(embed)
                    if (row.mod_logs_enabled === "disabled") return;
                    message.channel.send("***The user has been successfully unmuted! :white_check_mark:***")
                })
            } else {
                message.channel.send("The user doesn't have the Muted role to be unmuted.")
            }
    })
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'unmute',
    description: 'Allows you to remove the muted role from a user.',
    usage: 'unmute @User'
};