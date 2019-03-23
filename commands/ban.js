const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
  if (!message.member.hasPermission("BAN_MEMBERS", false, true, true)) return message.reply('Sorry, you\'re missing the required permission to run this command, need BAN_MEMBERS. :x:');
  if (!message.guild.member(client.user).hasPermission('BAN_MEMBERS')) return message.reply('Sorry, I don\'t have the required permission to do this command I need BAN_MEMBERS. :x:');
  sql.get(`SELECT gp.prefix, gz.casenumber, gz.mod_logs_enabled, gz.mod_logs_channel FROM guild_prefix as gp left join guild_moderation_settings as gz on gp.guildId = gz.guildId WHERE gp.guildId = '${message.guild.id}'`).then(row => {
    const prefixtouse = row.prefix
    const usage = new Discord.RichEmbed()
      .setColor(0x6B363E)
      .setThumbnail(client.user.avatarURL)
      .setTitle("Command: " + prefixtouse + "ban")
      .addField("Usage", prefixtouse + "ban @User <reason>")
      .addField("Example", prefixtouse + "ban @Katrix#0101 Attacking the Staff Team.")
      .setDescription("Description: " + "Bans a user from the current server.");

    if (message.mentions.users.size < 1) {
      message.channel.send('```Which user would you like to unban?\n\n# Type the username to continue.\n# Type exit to leave this menu.```')
        .then(() => {
          message.channel.awaitMessages(m => m.author.id === message.author.id, {
              max: 1,
              time: 30000,
              errors: ['time'],
            })
            .then((resp) => {
              if (!resp) return;
              resp = resp.array()[0];
              if (resp.content === 'exit') return message.channel.send('Ban command cancelled.');
              let user_fix = resp.content.replace('<@', '').replace('>', "");
              let user = message.guild.member(`${user_fix}`) || message.guild.members.get(`${resp.content}`);
              if (user.highestRole.position >= message.member.highestRole.position) return message.reply('I cant ban that member. They are the same level as you or higher. :x:');
              message.channel.send('```What reason do you want to ban them for?\n\n# Type the 1 for no reason or type a reason to continue.\n# Type exit to leave this menu.```')
                .then(() => {
                  message.channel.awaitMessages(m => m.author.id === message.author.id, {
                      max: 1,
                      time: 30000,
                      errors: ['time'],
                    })
                    .then((resp) => {
                      if (!resp) return;
                      resp = resp.array()[0];
                      if (resp.content === '1') {
                        let reason = 'Moderator didn\'t provide a reason.'
                        let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                        if (!message.guild.member(user).bannable) return message.reply(' I cant ban that member. This may be happening because they are above me. :x:');
                        message.guild.ban(user, 2);
                        message.channel.send("***The User has been successfully banned! :white_check_mark:***")
                        if (user.user.bot) return;
                        sql.run(`UPDATE guild_moderation_settings SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);

                        const embed = new Discord.RichEmbed()
                          .setColor(0x6B363E)
                          .setTitle("Case #" + row.casenumber + " | Action: Ban")
                          .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                          .addField("User", user.user.tag + " (ID: " + user.user.id + ")")
                          .addField("Reason", reason, true)
                          .setFooter("Time used: " + message.createdAt.toDateString())
                        /*sql.get(`SELECT * FROM punishmentshistory WHERE guildId = "${message.guild.id}" AND userId = "${user.user.id}"`).then(row1 => {
                          if (row1.punishments === "none") {
                            sql.run(`UPDATE punishmentshistory SET bans = ${row1.bans + 1}, punishments = "Case: #${row.casenumber} - ban - ${reason} \n" WHERE guildId = ${message.guild.id} AND userId = ${user.user.id}`);
                          } else {
                            sql.run(`UPDATE punishmentshistory SET bans = ${row1.bans + 1}, punishments = "${row1.punishments} Case: #${row.casenumber} - ban - ${reason} \n" WHERE guildId = ${message.guild.id} AND userId = ${user.user.id}`);
                          }
                        })*/
                        if (!modlog) return;
                        if (row.mod_logs_enabled === 'disabled') return;
                        client.channels.get(modlog.id).send(embed);
                      } else {
                        let reason = resp.cotent
                        let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                        if (!message.guild.member(user).bannable) return message.reply(' I cant ban that member. This may be happening because they are above me. :x:');
                        message.guild.ban(user, 2);
                        message.channel.send("***The User has been successfully banned! :white_check_mark:***")
                        if (user.user.bot) return;
                        sql.run(`UPDATE guild_moderation_settings SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);

                        const embed = new Discord.RichEmbed()
                          .setColor(0x6B363E)
                          .setTitle("Case #" + row.casenumber + " | Action: Ban")
                          .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                          .addField("User", user.user.tag + " (ID: " + user.user.id + ")")
                          .addField("Reason", reason, true)
                          .setFooter("Time used: " + message.createdAt.toDateString())
                        /*sql.get(`SELECT * FROM punishmentshistory WHERE guildId = "${message.guild.id}" AND userId = "${user.user.id}"`).then(row1 => {
                          if (row1.punishments === "none") {
                            sql.run(`UPDATE punishmentshistory SET bans = ${row1.bans + 1}, punishments = "Case: #${row.casenumber} - ban - ${reason} \n" WHERE guildId = ${message.guild.id} AND userId = ${user.user.id}`);
                          } else {
                            sql.run(`UPDATE punishmentshistory SET bans = ${row1.bans + 1}, punishments = "${row1.punishments} Case: #${row.casenumber} - ban - ${reason} \n" WHERE guildId = ${message.guild.id} AND userId = ${user.user.id}`);
                          }
                        })*/
                        if (!modlog) return;
                        if (row.mod_logs_enabled === 'disabled') return;
                        client.channels.get(modlog.id).send(embed);
                      }
                    }).catch((err) => {
                      if (err.message === undefined) {
                        message.channel.send('You provided no input in the time limit, please try again.')
                      } else {
                        console.log(err)
                        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                      }
                    });
                }).catch((err) => {
                  if (err.message === undefined) {
                    message.channel.send('You provided no input in the time limit, please try again.')
                  } else {
                    console.log(err)
                    return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                  }
                });
            }).catch((err) => {
              if (err.message === undefined) {
                message.channel.send('You provided no input in the time limit, please try again.')
              } else {
                console.log(err)
                return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
              }
            });
        }).catch((err) => {
          if (err.message === undefined) {
            message.channel.send('You provided no input in the time limit, please try again.')
          } else {
            console.log(err)
            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
          }
        });

    } else {
      let user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args.slice(0).join(" "));
      if (user.highestRole.position >= message.member.highestRole.position) return message.reply('I cant ban that member. They are the same level as you or higher. :x:');
      let reason = args.slice(1).join(' ') || `Moderator didn't give a reason.`;
      let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
      if (!message.guild.member(user).bannable) return message.reply(' I cant ban that member. This may be happening because they are above me. :x:');
      message.guild.ban(user, 2);
      message.channel.send("***The User has been successfully banned! :white_check_mark:***")
      if (user.user.bot) return;
      sql.run(`UPDATE guild_moderation_settings SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);

      const embed = new Discord.RichEmbed()
        .setColor(0x6B363E)
        .setTitle("Case #" + row.casenumber + " | Action: Ban")
        .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
        .addField("User", user.user.tag + " (ID: " + user.user.id + ")")
        .addField("Reason", reason, true)
        .setFooter("Time used: " + message.createdAt.toDateString())
      /*sql.get(`SELECT * FROM punishmentshistory WHERE guildId = "${message.guild.id}" AND userId = "${user.user.id}"`).then(row1 => {
        if (row1.punishments === "none") {
          sql.run(`UPDATE punishmentshistory SET bans = ${row1.bans + 1}, punishments = "Case: #${row.casenumber} - ban - ${reason} \n" WHERE guildId = ${message.guild.id} AND userId = ${user.user.id}`);
        } else {
          sql.run(`UPDATE punishmentshistory SET bans = ${row1.bans + 1}, punishments = "${row1.punishments} Case: #${row.casenumber} - ban - ${reason} \n" WHERE guildId = ${message.guild.id} AND userId = ${user.user.id}`);
        }
      })*/
      if (!modlog) return;
      if (row.mod_logs_enabled === 'disabled') return;
      client.channels.get(modlog.id).send(embed);
    }
  })
}

exports.conf = {
  guildOnly: false,
  aliases: [],
  commandCategory: 'moderation'
};

exports.help = {
  name: 'ban',
  description: 'Allows you to ban a user from the server.',
  usage: 'ban @User [reason]'
};