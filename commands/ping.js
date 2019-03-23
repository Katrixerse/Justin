const Discord = require('discord.js');
exports.run = async (client, message) => {
  const embed = new Discord.RichEmbed()
    .setColor(0x6B363E)
    .setDescription('Ping?');
  const msg = await message.channel.send(embed);
  const embed2 = new Discord.RichEmbed()
    .setColor(0x6B363E)
    .setDescription(`:ping_pong: Pong!\n:stopwatch: Latency is     ${msg.createdTimestamp - message.createdTimestamp}ms.\n :heartbeat: API Latency is: ${Math.round(client.ping)}ms.`)
  msg.edit(embed2);
};
  
exports.conf = {
  guildOnly: false,
  aliases: [],
  commandCategory: 'misc'
};
  
exports.help = {
  name: 'ping',
  description: 'Ping/Pong command. I wonder what this does? /sarcasm',
  usage: 'ping'
};