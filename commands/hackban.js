const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = async (client, message, args) => {
    sql.get(`SELECT gp.prefix, gz.casenumber, gz.mod_logs_enabled, gz.mod_logs_channel FROM guild_prefix as gp left join guild_moderation_settings as gz on gp.guildId = gz.guildId WHERE gp.guildId = '${message.guild.id}'`).then(row => {
    const prefixtouse = row.prefix
    const usage = new Discord.RichEmbed()
      .setColor(0x6B363E)
      .setThumbnail(client.user.avatarURL)
      .setTitle("Command: " + prefixtouse + "hackban")
      .addField("Usage", prefixtouse + "hackban <ID> <reason>")
      .addField("Example", prefixtouse + "hackban 130515926117253122 self bot that dms server links and left.")
      .setDescription("Description: " + "Bans a user without needing to be in the server.");

    if (message.member.hasPermission("BAN_MEMBERS", false, true, true)) {
      if (!message.guild.member(client.user).hasPermission('BAN_MEMBERS')) return message.reply('Sorry, I don\'t have the permissions to do this cmd I need BAN_MEMBERS. :x:')
      let user = args[0]
      if (isNaN(user)) return message.channel.send(usage)
      let reason = args[1] || `Moderator didn't give a reason.`;
      if (!user) return message.reply('You must supply a User Resolvable, such as a user id.')
      let guild = message.member.guild;
      if (user.length < 1) return message.channel.send("need to provide a valid user id to ban them");
      if (user === message.author.id) return message.channel.send(`:x: Well no you can't hackban yourself`);
      if (message.guild.members.get(user)) return message.channel.send(`:x: That user is in this server, please use ban instead`);
      let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
      client.fetchUser(user).then(id => {
        message.guild.ban(user, 2)
        sql.run(`UPDATE guild_moderation_settings SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
        const embed = new Discord.RichEmbed()
          .setColor(0x6B363E)
          .setTitle("Case #" + row.casenumber + " | Action: Hack Ban")
          .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
          .addField("User ID", user)
          .addField("Reason", reason, true)
          .setFooter("Time used: " + message.createdAt.toDateString())
        message.channel.send("User: " + id + ", has been banned from the server.");
        if (!modlog) return;
        if (row.mod_logs_enabled === 'disabled') return;
        client.channels.get(modlog.id).send({embed});
      }).catch((err) => { 
          message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`)
      })
    }
  })
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'moderation'
  };
  
  exports.help = {
    name: 'hackban',
    description: 'Allows you to ban a user without being in the server.',
    usage: 'hackban <userID> [reason]'
  };