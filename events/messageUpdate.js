const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
module.exports = (client, message, editedMessage) => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  if (!message.guild.member(client.user).hasPermission('SEND_MESSAGES')) return;
    if (!message.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
    if (!message.guild.member(client.user).hasPermission('VIEW_CHANNEL')) return;
    if (!message.guild.member(client.user).hasPermission('READ_MESSAGE_HISTORY')) return;
    sql.get(`SELECT mod_logs_channel FROM guild_moderation_settings WHERE guildId ="${message.guild.id}"`).then(row => {
    if (message.author.bot) return;
    if (message === editedMessage) return;
    if (message.channel.type !== 'text') return;
    const description = message.cleanContent
    const descriptionfix = description.substr(0, 1000);
    let guild = message.guild;
    let modlog = guild.channels.find(channel => channel.name == row.mod_logs_channel)
     if (!modlog) return;
    const embed = new Discord.RichEmbed()
    .setColor(0x6B363E)
    .setThumbnail(message.author.avatarURL)
    .addField("Author ", `${message.author.tag} (ID: ${message.author.id})`)
    .addField("Before Edit ", `${descriptionfix}`)
    .addField("After Edit", `${editedMessage}`)
    .setTimestamp()
    .setFooter("Message edited in " + message.channel.name);
    if (message.content.includes("http")) return;
    if (message.content.includes("www.")) return;
    client.channels.get(modlog.id).send({embed});
  })
}
