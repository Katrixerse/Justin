const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = async (client, message, args) => {
    if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) return message.reply('Sorry, I don\'t have the permission to do this command I need MANAGE_ROLES. :x:')
    const new_role = args.join(' ');
    if (new_role < 1) return message.channel.send(`Need to pick a new role, to change it.`)
    if (new_role.length >= 15) message.channel.send(`New muted role can\'t be 15 characters or higher.`)
    let validate_role = message.guild.roles.find('name', new_role)
    if (!validate_role) return message.channel.send(`I Couldn't find the role: ${new_role} make sure it is a valid role.`)
    if (validate_role.position >= message.guild.member(client.user).highestRole.position) return message.reply(`I Can't give roles that are the same as me or higher. :x:`);
    sql.run(`UPDATE guild_misc_settings SET mute_role = '${new_role}' WHERE guildId = ${message.guild.id}`);
    message.channel.send(`The muted role has been switched too: ${new_role}`)
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'mute-role',
    description: 'Allows you to change the role used for mute.',
    usage: 'mute-role [newrole]'
};