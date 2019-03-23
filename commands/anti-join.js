const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
     if (message.member.hasPermission("BAN_MEMBERS")) {
        sql.get(`SELECT gp.prefix, gz.casenumber, gz.mod_logs_enabled, gz.mod_logs_channel gj.anti_join_enabled FROM guild_prefix as gp left join guild_moderation_settings as gz on gp.guildId = gz.guildId left join guild_autorole_antijoin_settings as gj on gp.guildId = gj.guildId WHERE gp.guildId = '${message.guild.id}'`).then(row => {
            const reason = args.join(' ') || `Moderator didn't give a reason.`;
            if (row.anti_join_enabled === "disabled") {
            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
            sql.run(`UPDATE guild_moderation_settings SET casenumber = ${row.casenumber + 1}, antijoin = "enabled" WHERE guildId = ${message.guild.id}`);
            message.channel.send("Anti-join has been enabled.")
            const embed = new Discord.RichEmbed()
             .setColor(0x00A2E8)
             .setTitle("Case #" + row.casenumber + " | Action: Anti Join on")
             .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
             .addField("In channel", message.channel.name, true)
             .addField("Reason", reason, true)
             .setFooter("Time used: " + message.createdAt.toDateString())
             if (!modlog) return;
             if (row.mod_logs_enabled === "disabled") return;
             client.channels.get(modlog.id).send({embed});
            } else {
            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
            sql.run(`UPDATE guild_moderation_settings SET casenumber = ${row.casenumber + 1}, antijoin = "disabled" WHERE guildId = ${message.guild.id}`);
            message.channel.send("Anti-join has been disabled.")
            const embed = new Discord.RichEmbed()
             .setColor(0x00A2E8)
             .setTitle("Case #" + row.casenumber + " | Action: Anti Join off")
             .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
             .addField("In channel", message.channel.name, true)
             .addField("Reason", reason, true)
             .setFooter("Time used: " + message.createdAt.toDateString())
             if (!modlog) return;
             if (row.mod_logs_enabled === "disabled") return;
             client.channels.get(modlog.id).send({embed}).catch(console.error);
            }
         })
    }
}
   
exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'moderation'
  };
  
  exports.help = {
    name: 'anti-join',
    description: 'Allows you to auto kick any new users that try to join the server.',
    usage: 'anti-join [reason]'
  };