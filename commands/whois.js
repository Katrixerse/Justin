const Discord = require("discord.js");
exports.run = (client, message, args) => {
  const usern = args.join(' ')
  if (usern.length < 1) {
    try {
      let embed2 = new Discord.RichEmbed()
        .setColor(0x6B363E)
        .setThumbnail(message.author.avatarURL)
        .addField("Username ", `${message.author.tag} (ID: ${message.author.id})`, true)
        .addField("Status", `${message.member.presence}` !== null && `${message.member.presence.status}` !== null ? `${message.member.presence.status}` : "Offline")
        .addField("Playing ", `${message.author.presence.game === null ? "None" :  message.author.presence.game.name}`, true)
        .addField("Nickname ", `${message.member.displayName}`, true)
        .addField("Role(s) ", `${message.member.roles.map(r => r.name).join(", ")}`)
        .addField("Highest Role ", message.member.highestRole.name)
        .addField("Joined Guild At ", `${message.member.joinedAt.toDateString()}`)
        .addField("Joined Discord At ", `${message.author.createdAt.toDateString()}`)
        .setTimestamp()
        .setFooter(message.author.username, message.author.avatarURL);
      return message.channel.send(embed2);
    } catch (err) {
      return message.channel.send(`Oh no, an error occurred: \`The user wasn't found\`. Try again later!`);
    }
  } else {
    try {
      let member = message.mentions.members.first() || message.guild.member(client.users.find(c => c.username === args.join(' ')))
      let embed = new Discord.RichEmbed()
        .setColor(0x6B363E)
        .setThumbnail(member.user.avatarURL)
        .addField("Username ", `${member.user.tag} (ID: ${member.id})`, true)
        .addField("Status", `${member.presence}` !== null && `${member.presence.status}` !== null ? `${member.presence.status}` : "Offline")
        .addField("Playing ", `${member.user.presence.game === null ? "Nothing" :  member.user.presence.game.name}`, true)
        .addField("Nickname ", `${member.nickname === null ? "None" : member.nickname}`, true)
        .addField("Role(s) ", `${member.roles.map(r => r.name).join(", ")}`)
        .addField("Highest Role ", `${member.highestRole.name}`)
        .addField("Joined Guild At ", `${member.joinedAt.toDateString()}`)
        .addField("Joined Discord At ", `${member.user.createdAt.toDateString()}`)
        .setTimestamp()
        .setFooter(member.user.username, member.user.avatarURL);
      return message.channel.send(embed)
    } catch (err) {
      return message.channel.send(`Oh no, an error occurred: \`The user wasn't found\`. Try again later!`);
    }
  }
}

exports.conf = {
  guildOnly: false,
  aliases: [],
  commandCategory: 'misc'
};

exports.help = {
  name: 'whois',
  description: 'whois [username/@Someone].',
  usage: 'whois Syntheti'
};