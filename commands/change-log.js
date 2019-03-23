const Discord = require("discord.js");
var changelog = [
      "- Added custom-commands.",
      "- Added manage-command.",
      "- Added manage-category.",
      "- Added customizable swear-filter to auto-mod.",
      "- Fixed admin in owners missing perms to use commands.",
      "- Rewriten the command handler.",
]
exports.run = (client, message, args) => {
      const embed = new Discord.RichEmbed()
      .setAuthor(client.user.username, client.user.avatarURL)
      .setColor(0x00A2E8)
      .setTitle("Changelog v1.0.0-Release")
      .addField("Changes", changelog)
      .setTimestamp()
      .setFooter(client.user.username, client.user.avatarURL);
      message.channel.send({embed}) 
 }
   
 exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'change-log',
    description: 'Gives you the latest changelog.',
    usage: 'change-log'
};