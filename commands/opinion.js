const Discord = require("discord.js");
const opinions = ['👍', '👎'];
exports.run = (client, message, args) => {
    try {
        const question = args.join(' ')
        let embed = new Discord.RichEmbed()
            .setDescription(`${question}\n${opinions[Math.floor(Math.random() * opinions.length)]}`)
            .setColor(0x6B363E)
        return message.channel.send(embed);
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
  };
    
  exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
  };
    
  exports.help = {
    name: 'opinion',
    description: 'Bot will give you its opinion on something.',
    usage: 'opinion [question]'
  };