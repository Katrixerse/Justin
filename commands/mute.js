const Discord = require("discord.js");
const sql = require("sqlite");
const ms = require('ms')
sql.open("./assets/db/botsdb.sqlite");
exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("KICK_MEMBERS", false, true, true) && !message.member.roles.map((e) => e).join(',').toString().includes(mod_roles)) return message.reply('Sorry, you\'re missing the required permission to run this command, need KICK_MEMBERS. :x:');
  sql.get(`SELECT gp.prefix, gz.casenumber, gz.mod_logs_enabled, gz.mod_logs_channel, gh.mute_role FROM guild_prefix as gp left join guild_moderation_settings as gz on gp.guildId = gz.guildId left join guild_misc_settings as gh on gp.guildId = gh.guildId WHERE gp.guildId = '${message.guild.id}'`).then(row => {
    const prefixtouse = row.prefix
    const usage = new Discord.RichEmbed()
      .setColor(0x6B363E)
      .setThumbnail(client.user.avatarURL)
      .setTitle("Command: " + prefixtouse + "mute")
      .addField("Usage", prefixtouse + "mute @Someone <time><m/h/d> <reason>")
      .addField("Example", prefixtouse + "mute @Someone 5h spamming in general.")
      .setDescription("Description: " + "Gives a user the muted role for x minutes");

      if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) return message.reply('Sorry, i dont have the perms to do this cmd i need MANAGE_ROLES. :x:')
      if (message.mentions.users.size < 1) return message.channel.send(usage)
      let user = message.guild.member(message.mentions.users.first());
      if (user.user.bot) return message.channel.send("Can not mute bots.")
      if (user.highestRole.position >= message.member.highestRole.position) return message.reply('I cant mute that member. They are the same level as you or higher. :x:');
      let reason = args.slice(2).join(' ') || `Moderator didn't give a reason.`;
      let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
      if (reason.length < 1) return;
      let muteRole = message.guild.roles.find(role => role.name === row.mute_role);
      if (user.roles.find(role => role.name == row.muted_role)) return message.channel.send("Seems the user already has the Muted role, I can't mute them again!");
      if (!muteRole) return message.channel.send(`I can't find the set Muted role, if you would like to set a new one please use ${prefixtouse}mute-role :x:`);
      if (muteRole.position >= message.guild.member(client.user).highestRole.position) return message.reply('I cant mute that member. The mute role is the same level as my role or higher. :x:');

      /*sql.get(`SELECT * FROM punishmentshistory WHERE guildId = "${message.guild.id}" AND userId = "${user.user.id}"`).then(row1 => {
        if (row1.punishments === "none") {
          sql.run(`UPDATE punishmentshistory SET mutes = ${row1.mutes + 1}, punishments = "Case: #${row.casenumber} - mute - ${reason} \n" WHERE guildId = ${message.guild.id} AND userId = ${user.user.id}`);
        } else {
          sql.run(`UPDATE punishmentshistory SET mutes = ${row1.mutes + 1}, punishments = "${row1.punishments} Case: #${row.casenumber} - mute - ${reason} \n" WHERE guildId = ${message.guild.id} AND userId = ${user.user.id}`);
        }
      })*/
      message.guild.member(user).addRole(muteRole)

      let messagez = args[1]
      let messagez2 = parseInt(args[1])
      let messagefix = ms(messagez);
      if (messagefix <= 60000) return message.channel.send("Can't mute for 1 min or less.")
      try {
        if (messagez2 >= 1) {
          if (ms(messagez) > 604800000) return message.channel.send('Maximum time is 7 day (10,080 minutes)');
          sql.run(`UPDATE guild_moderation_settings SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
          message.channel.send("***The user has been successfully muted for " + ms(messagefix) + "(s) :white_check_mark:***")
          if (!modlog) {
            setTimeout(() => {
              if (message.guild.member(user).roles.has(muteRole.id)) {
                message.guild.member(user).removeRole(muteRole)
                message.channel.send(user.user.username + ' has now been unmuted after ' + ms(messagefix) + '(s)')
              }
            }, messagefix);
          } else if (row.mod_logs_enabled === "disabled") {
            setTimeout(() => {
              if (message.guild.member(user).roles.has(muteRole.id)) {
                message.guild.member(user).removeRole(muteRole)
                message.channel.send(user.user.username + ' has now been unmuted after ' + ms(messagefix) + '(s)')
              }
            }, messagefix);
          } else {
            const embed2 = new Discord.RichEmbed()
              .setColor(0x6B363E)
              .setTitle("Case #" + row.casenumber + " | Action: Mute")
              .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
              .addField("User", user.user.tag + " (ID: " + user.user.id + ")")
              .addField("Time", messagez, true)
              .addField("Reason", reason, true)
              .setFooter("Time used: " + message.createdAt.toDateString())
            client.channels.get(modlog.id).send(embed2)
            setTimeout(() => {
              if (message.guild.member(user).roles.has(muteRole.id)) {
                message.guild.member(user).removeRole(muteRole)
                message.channel.send(user.user.username + ' has now been unmuted after ' + ms(messagefix) + '(s)')
              }
            }, messagefix);
          }
        } else {
          message.channel.send("***The user has been successfully muted :white_check_mark:***")
          if (!modlog) return;

          const embed = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setTitle("Case #" + row.casenumber + " | Action: Mute")
            .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
            .addField("User", user.user.tag + " (ID: " + user.user.id + ")")
            .addField("Time", "No time was set.", true)
            .addField("Reason", reason, true)
            .setFooter("Time used: " + message.createdAt.toDateString())
          client.channels.get(modlog.id).send(embed)
        }
      } catch (err) {
        message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
      }
  })
}

exports.conf = {
  guildOnly: false,
  aliases: [],
  commandCategory: 'moderation'
};

exports.help = {
  name: 'mute',
  description: 'Allows you to mute a user.',
  usage: 'mute @User [reason]'
};