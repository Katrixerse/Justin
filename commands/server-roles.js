const Discord = require('discord.js');
exports.run = async (client, message) => {
    try {
        const role = message.guild.roles;
        const embed = new Discord.RichEmbed()
            .addField("Server Roles", role.map((e) => e).join(', '))
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
    name: 'server-roles',
    description: 'Lists all roles in the server.',
    usage: 'server-roles'
};