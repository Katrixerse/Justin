const Discord = require("discord.js");
exports.run = (client, message, args) => {
    let role_name = args.join(' ')
    let role = client.guilds.get(message.guild.id).roles.find(role => role.name === role_name);
    if (!role) return message.channel.send(`I couldn't find the role: ${role_name} in this server.`);
    const embed = new Discord.RichEmbed()
        .setColor(0x00A2E8)
        .addField('Name/ID', `${role.name}(ID: ${role.id})`)
        .addField('Color', role.hexColor.toUpperCase())
        .addField('Created At', role.createdAt.toDateString())
        .addField('Hoisted?', role.hoist ? 'Yes' : 'No')
        .addField("Mentionable: ", role.mentionable ? 'Yes' : 'No')
    message.channel.send(embed)
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'role-info',
    description: 'Lets you get more info on a role.',
    usage: 'role-info <name>'
};