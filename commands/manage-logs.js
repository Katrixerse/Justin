const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_GUILD", false, true, true)) return message.channel.send("You're missing MANAGE_GUILD permission");
  sql.get(`SELECT gp.prefix, gz.casenumber, gz.mod_logs_enabled, gz.mod_logs_channel FROM guild_prefix as gp left join guild_moderation_settings as gz on gp.guildId = gz.guildId WHERE gp.guildId = '${message.guild.id}'`).then(row => {

    const prefixtouse = row.prefix
    const embed10 = new Discord.RichEmbed()
      .setColor(0x00A2E8)
      .setThumbnail(client.user.avatarURL)
      .setTitle("Command: " + prefixtouse + "logs")
      .addField("Usage", prefixtouse + "logs [number]")
      .addField("Example", "[1] - Enables logs channel\n[2] - Disable logs channel\n[3] - Change logs channel")
      .setDescription("Description: " + "Used to configure the bots moderation logs.");

    const toenable = args[0]

    const helpembed = new Discord.RichEmbed()
      .setColor(0x00A2E8)
      .addField('Which logs setting would you like to change?', '```\n[1] - Enable Mod Logs\n[2] - Disable Mod Logs\n[3] - Change Mod Logs Channel\n\n# Type the number to see the page.\n# Type exit to leave this menu.```')
    message.channel.send(helpembed)
      .then(() => {
        message.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30000,
            errors: ['time'],
          })
          .then((resp) => {
            if (!resp) return;
            resp = resp.array()[0];
            if (resp.content === "1") {
              sql.run(`UPDATE guild_moderation_settings SET mod_logs_enabled = "enabled" WHERE guildId = ${message.guild.id}`);
              message.channel.send("I have enabled logs for this guild.")
              let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
              const embed = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTitle("Case #" + row.casenumber + " | Action: Logs Enabled")
                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                .setFooter("Time used: " + message.createdAt.toDateString())
              if (!modlog) return;
              if (row.logsenabled === "disabled") return;
              client.channels.get(modlog.id).send(embed);
            } else if (resp.content === "2") {
              sql.run(`UPDATE guild_moderation_settings SET mod_logs_enabled = "disabled" WHERE guildId = ${message.guild.id}`);
              message.channel.send("I have disabled logs for this guild.")
              let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
              const embed = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTitle("Case #" + row.casenumber + " | Action: Logs Disabled")
                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                .setFooter("Time used: " + message.createdAt.toDateString())
              if (!modlog) return;
              if (row.logsenabled === "disabled") return;
              client.channels.get(modlog.id).send(embed);
            } else if (resp.content === "3") {
              const helpembed = new Discord.RichEmbed()
              .setColor(0x00A2E8)
              .addField('Which channel would you like to send logs to?', '```\n[channelname] - What would you like the new mod log channel to be?\n\n# Type exit to leave this menu.```')
              message.channel.send(helpembed)
                .then(() => {
                  message.channel.awaitMessages(m => m.author.id === message.author.id, {
                      max: 1,
                      time: 30000,
                      errors: ['time'],
                    })
                    .then((resp) => {
                      //if (!resp) return;
                      resp = resp.array()[0];
                      if (resp < 1) return message.channel.send("Need to provide a channel name to set a new mod logs channel.")
                      if (resp.content === "exit") {
                        message.channel.send("Cancelled logs command.")
                      } else {
                        const newlogschannel = resp.content.replace(/[^\x00-\x7F]/g, "");
                        if (resp < 1) return message.channel.send("Didn't provide a new channel name to set")
                        let newchanneltoset = message.guild.channels.find(channel => channel.name == resp);
                        if (!newchanneltoset) return message.channel.send("The channel " + resp + " doesn't exist.")
                        if (newchanneltoset.type === "category") return message.channel.send("The channel " + resp + " doesn't exist.")
                        if (newlogschannel.length < 1) return message.channel.send("Prefix can't have non-ascii characters")
                        if (resp.length > 20) return message.channel.send("channel name can't be longer then 20 characters")
                        if (!row.logschannel) return;
                        sql.run(`UPDATE guild_moderation_settings SET mod_logs_channel = "${newlogschannel}", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
                        message.channel.send("I have set the new guild logs channel to " + newlogschannel)
                        let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
                        const embed = new Discord.RichEmbed()
                          .setColor(0x00A2E8)
                          .setTitle("Case #" + row.casenumber + " | Action: Logs Channel Change")
                          .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                          .addField("New logs channel", newlogschannel, true)
                          .setFooter("Time used: " + message.createdAt.toDateString())
                        if (!modlog) return;
                        if (row.logsenabled === "disabled") return;
                        client.channels.get(modlog.id).send(embed);
                    }
                  }).catch((err) => {
                    console.log(err)
                  });
                })
            } else if (resp.content === "exit") {
              message.channel.send("Cancelled logs command.")
            } else {}
          })
          .catch((err) => {
            console.log(err)
          });
      })
  })
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'manage-logs',
    description: 'Allows you to manage the bots logs for the server.',
    usage: 'manage-logs'
};