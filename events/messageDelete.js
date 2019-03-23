const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
module.exports = (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (!message.guild.member(client.user).hasPermission('SEND_MESSAGES')) return;
    if (!message.guild.member(client.user).hasPermission('VIEW_CHANNEL')) return;

    sql.get(`SELECT mod_logs_channel FROM guild_moderation_settings WHERE guildId ="${message.guild.id}"`).then(row => {
    if (message.author.bot) return;
    if (message.channel.type !== 'text') return;
    const description = message.cleanContent
    const descriptionfix = description.substr(0, 600);
    let guild = message.guild;
    let modlog = guild.channels.find(channel => channel.name == row.mod_logs_channel)
     if (!modlog) return;
     if (message.attachments.size > 0) {
       try {
        message.attachments.forEach(a => {
          const logembed = new Discord.RichEmbed()
              .setThumbnail(message.author.avatarURL)
              .addField("Author ", `${message.author.tag} (ID: ${message.author.id})`)
              .setImage(a.proxyURL)
              .setColor(0x6B363E)
              .setTimestamp()
              .setFooter(`Image deleted in ` + message.channel.name)
              client.channels.get(modlog.id).send(logembed);
      })
      } catch (err) {
        console.log(err)
      }
     } else {
      const embed = new Discord.RichEmbed()
        .setColor(0x6B363E)
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Author ${message.author.tag} (ID: ${message.author.id})`)
        .setDescription(`${descriptionfix}`)
        .setTimestamp()
        .setFooter("Message deleted in " + message.channel.name);
      client.channels.get(modlog.id).send({embed});
     }
  })
}
  

