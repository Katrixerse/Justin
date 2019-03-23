const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_GUILD", false, true, true)) return message.reply('Sorry, you\'re missing the required permission to use this command, need MANAGE_GUILD. :x:');
  sql.get(`SELECT welcome_message FROM guild_wl_system WHERE guildId ="${message.guild.id}"`).then(row => {
    let WelcomeMess = row.welcome_message;
    var WelcomeFix = WelcomeMess.replace("%MENTION%", "<@" + message.author.id + ">").replace("%GUILDNAME%", message.guild.name).replace("%NAME%", message.author.username).replace("%MEMBERCOUNT%", message.guild.memberCount)
    message.channel.send(WelcomeFix)
  })
}

exports.conf = {
  guildOnly: false,
  aliases: [],
  commandCategory: 'moderation'
};

exports.help = {
  name: 'welcome-test',
  description: 'Allows you to see how the welcome message looks.',
  usage: 'welcome-test'
};