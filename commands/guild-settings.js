const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    sql.get(`SELECT gp.prefix, gz.mod_logs_enabled, gz.mod_logs_channel, gh.welcome_message, gh.leave_message, gv.automod_enabled, gv.anti_invite_enabled, gv.anti_weblink_enabled, gv.anti_dup_char_enabled FROM guild_prefix as gp left join guild_moderation_settings as gz on gp.guildId = gz.guildId left join guild_wl_system as on gh.guildId = gz.guildID left join guild_amod_settings as gv on gv.guildId = gz.guildId WHERE gp.guildId = '${message.guild.id}'`).then(row => {
    const embed = new Discord.RichEmbed()
        .setColor(0x00A2E8)
        .setTitle("Guild settings")
        .addField("General", `Prefix: ${row.prefix}`)
        .addField("Messages", `Welcome message: ${row.welcome_message} \nLeave message: ${row.leave_message}`)
        .addField("Channels", `Welcome/leave channel: ${row.wlchannel} \nLogs channel: ${row.mod_logs_channel}`)
        .addField("Moderation", `Anti invite: ${row.anti_invite_enabled} \nAnti website link: ${row.anti_weblink_enabled} \nAnti dup characters: ${row.anti_dup_char_enabled}\nMod only commands: ${row.modonlycommands}`)
        .addField("Misc", `Anti join: ${row.antijoin} \nAutorole: ${row.autoroleenabled}\nProfile/Level system: ${row.levelsystem}`);
      message.channel.send(embed)
    })
}

exports.conf = {
  guildOnly: false,
  aliases: [],
  commandCategory: 'main'
};

exports.help = {
  name: 'guild-settings',
  description: 'Shows all the current guild settings.',
  usage: 'guild-settings'
};