const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
const Discord = require("discord.js");
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD", false, true, true)) return message.channel.send("You are missing MANAGE_GUILD permission");
    sql.get(`SELECT casenumber, mod_only_enabled FROM guild_moderation_settings WHERE guildId ="${message.guild.id}"`).then(row => {
        if (row.mod_only_enabled === "disabled") {
            sql.run(`UPDATE guild_moderation_settings SET mod_only_enabled = "enabled", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
            message.channel.send("Now only mods/mods+ can use the bot commands.")
            let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
            const embed = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTitle("Case #" + row.casenumber + " | Action: Mod-Only Cmds Enabled")
                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                .setFooter("Time used: " + message.createdAt.toDateString())
            if (!modlog) return;
            if (row.logsenabled === "disabled") return;
            return client.channels.get(modlog.id).send({embed});
        } else {
            sql.run(`UPDATE guild_moderation_settings SET mod_only_enabled = "disabled", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
            message.channel.send("Now anyone can use the bot commands.")
            let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
            const embed = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTitle("Case #" + row.casenumber + " | Action: Mod-Only Cmds Disabled")
                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                .setFooter("Time used: " + message.createdAt.toDateString())
            if (!modlog) return;
            if (row.logsenabled === "disabled") return;
            return client.channels.get(modlog.id).send({embed});
        }
    })
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'mod-only',
    description: 'Allows owners to make the bot commands respond to users with KICK_MEMEBERS perm or have been added using j!addmod.',
    usage: 'mod-only'
};