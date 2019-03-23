const Discord = require("discord.js");
exports.run = (client, message, args) => {
  const user = message.mentions.users.first();
  if (user < 1) return message.channel.send("Didn't provide a user to get their ID.")
  const embed = new Discord.RichEmbed()
    .setDescription(`${user.username}'s ID is ${user.id}.`)
    .setColor(0x00A2E8);
  message.channel.send(embed);
}
   
exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'roleplay'
};

exports.help = {
    name: 'id',
    description: 'Gives you a user ID without needing developer mode on.',
    usage: 'id @User'
};