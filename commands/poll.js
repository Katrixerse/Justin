const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    try {
        if (!message.guild.member(client.user).hasPermission('ADD_REACTIONS')) return message.reply('I need the ADD_REACTIONS permission to use this command.')
        const channeltosend = args[0]
        const sayMessage = args.slice(1).join(" ");
        if (sayMessage.length < 1) return message.channel.send("Didnt provide anything for the poll.")
        if (message.member.hasPermission("KICK_MEMBERS", false, true, true)) {
            let channelsend = message.guild.channels.find(channel => channel.name == channeltosend);
            const embed = new Discord.RichEmbed()
                .setColor(0x6B363E)
                .setTitle(" Poll ")
                .setDescription(`A poll has begun! The poll is: "**${sayMessage}**"!, vote now!`)
            return client.channels.get(channelsend.id).send(embed).then(m => {
                m.react('✅');
                m.react('❌');
            })
        }
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
    name: 'poll',
    description: 'Will start a poll for your members too vote in.',
    usage: 'poll'
};