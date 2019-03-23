const Discord = require('discord.js');
exports.run = async (client, message) => {
    try {
        const role = message.guild.roles.size;
        const online = message.guild.members.filter(m => m.presence.status != 'offline').size
        const verificationLevels = ['None', 'Low', 'Medium', 'Insane', 'Extreme'];
        const embed = new Discord.RichEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL)
            .setColor(0x6B363E)
            .setDescription(`Owner: ${message.guild.owner.user.tag} (${message.guild.owner.id})`)
            .addField('Member Count', `${message.guild.memberCount}`, true)
            .addField('Online', `${online}`, true)
            .addField('Server Region', message.guild.region)
            .addField('Created At', message.guild.createdAt.toLocaleString(), true)
            .addField("Verification Level: ", `${verificationLevels[message.guild.verificationLevel]}`)
            .addField('Voice Channels', `${message.guild.channels.filter(chan => chan.type === 'voice').size}`)
            .addField('Text Channels', `${message.guild.channels.filter(chan => chan.type === 'text').size}`, true)
            .addField('Roles', role, true)
        return message.channel.send(embed)
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
    name: 'server-info',
    description: 'Gives info on the server.',
    usage: 'server-info'
};