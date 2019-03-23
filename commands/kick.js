const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args, mod_roles) => {
  if (!message.member.hasPermission("KICK_MEMBERS", false, true, true) && !message.member.roles.map((e) => e).join(',').toString().includes(mod_roles)) return message.reply('Sorry, you\'re missing the required permission to run this command, need KICK_MEMBERS. :x:');
  sql.get(`SELECT gp.prefix, gz.casenumber, gz.mod_logs_enabled, gz.mod_logs_channel FROM guild_prefix as gp left join guild_moderation_settings as gz on gp.guildId = gz.guildId WHERE gp.guildId = '${message.guild.id}'`).then(row => {
  const prefixtouse = row.prefix;
  const usage = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setThumbnail(client.user.avatarURL)
            .setTitle("Command: " + prefixtouse + "kick")
            .addField("Usage", prefixtouse + "kick @Someone <reason>")
            .addField("Example", prefixtouse + "kick @Someone for ad links to other discords")
            .setDescription("Description: " + "Kicks a user from the current server");

  if (!message.guild.member(client.user).hasPermission('KICK_MEMBERS')) return message.reply('Sorry, I don\'t have the perms to do this command I need KICK_MEMBERS. :x:')
    let reason = args.slice(1).join(' ') || `Moderator didn't give a reason.`;
    if (message.mentions.users.size < 1) return message.channel.send(usage);
    let user = message.guild.member(message.mentions.users.first());
  if (user.highestRole.position >= message.member.highestRole.position) return message.reply('I cant kick that member. They are the same level as you or higher. :x:');
  let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
  sql.run(`UPDATE guild_moderation_settings SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
  message.channel.send("***The User has been successfully kicked! :white_check_mark:***");
  if (!message.guild.member(user).kickable) return message.reply('I cant kick that member :x:');
  message.guild.member(user).kick();
  if (user.user.bot) return;
  const embed = new Discord.RichEmbed()
    .setColor(0x6B363E)
    .setTitle("Case #" + row.casenumber + " | Action: Kick")
    .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
    .addField("User", user.user.tag + " (ID: " + user.user.id + ")")
    .addField("Reason", reason, true)
    .setFooter("Time used: " + message.createdAt.toDateString());
    /*sql.get(`SELECT * FROM punishmentshistory WHERE guildId = "${message.guild.id}" AND userId = "${user.user.id}"`).then(row1 => {
      if (row1.punishments === "none") {
        sql.run(`UPDATE punishmentshistory SET kicks = ${row1.kicks + 1}, punishments = "Case: #${row.casenumber} - kick - ${reason} \n" WHERE guildId = ${message.guild.id} AND userId = ${user.user.id}`);
      } else {
        sql.run(`UPDATE punishmentshistory SET kicks = ${row1.kicks + 1}, punishments = "${row1.punishments} Case: #${row.casenumber} - kick - ${reason} \n" WHERE guildId = ${message.guild.id} AND userId = ${user.user.id}`);
      }
    })*/
    if (!modlog) return;
    if (row.mod_logs_enabled === "disabled") return;
    client.channels.get(modlog.id).send({embed});
  })
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'moderation'
  };
  
  exports.help = {
    name: 'kick',
    description: 'Allows you to kick a user from the server.',
    usage: 'kick @User [reason]'
  };
   
