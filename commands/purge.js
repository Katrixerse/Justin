const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
  sql.get(`SELECT gp.prefix, gz.casenumber, gz.mod_logs_enabled, gz.mod_logs_channel FROM guild_prefix as gp left join guild_moderation_settings as gz on gp.guildId = gz.guildId WHERE gp.guildId = '${message.guild.id}'`).then(row => {
    const prefixtouse = row.prefix;
    const usage = new Discord.RichEmbed()
      .setColor(0x6B363E)
      .setThumbnail(client.user.avatarURL)
      .setTitle("Command: " + prefixtouse + "purge")
      .addField("Usage", prefixtouse + "purge <amount> @Someone")
      .addField("Example", prefixtouse + "purge 20 server was raided.")
      .setDescription("Description: " + "Purges the channels messages (min 3 max 99)");

    let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
    if (!message.member.permissions.has("MANAGE_MESSAGES")) {
      message.channel.send('Sorry, you do not have permission to perform the purge command. :x:');
      return;
    } else if (!message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) {
      message.channel.send("Sorry, I don\'t have the permission to do this command I need MANAGE_MESSAGES. :x:");
      return;
    }
    const user = message.mentions.users.first()
    const amount = !!parseInt(message.content.split(' ')[2]) ? parseInt(message.content.split(' ')[2]) : parseInt(message.content.split(' ')[1])
    let reason = args[3] || `Moderator didn't give a reason.`;
    if (!amount) return message.channel.send(usage);
    if (!amount && !user) return message.channel.send(usage);
    message.channel.fetchMessages({
      limit: amount,
    }).then((messages) => {
      if (user) {
        const filterBy = user ? user.id : client.user.id;
        messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount + 1);
      }
      if (amount <= 2) return message.channel.send("Can only delete a min of 2 messages");
      if (amount >= 98) return message.channel.send("Can only delete a max of 98 messages");
      message.channel.bulkDelete(messages, true).catch(error => console.log(error.stack));
      message.channel.send("***The server messages/users messages has been successfully purged! :white_check_mark:***");
      sql.run(`UPDATE guild_moderation_settings SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
      const embed = new Discord.RichEmbed()
        .setColor(0x6B363E)
        .setTitle("Case #" + row.casenumber + " | Action: Purge")
        .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
        .addField("Purge Amount", amount)
        .addField("In channel", message.channel.name, true)
        .addField("Reason", reason, true)
        .setFooter("Time used: " + message.createdAt.toDateString());
      if (!modlog) return;
      if (row.mod_logs_enabled === "disabled") return;
      return client.channels.get(modlog.id).send({
        embed
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
  name: 'purge',
  description: 'Allows you to purge messages sent from users.',
  usage: 'purge amount/@User [amount]'
};