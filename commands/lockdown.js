const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
const ms = require('ms');
exports.run = (client, message, args, mod_roles) => {
    if (!message.member.hasPermission("KICK_MEMBERS", false, true, true) && !message.member.roles.map((e) => e).join(',').toString().includes(mod_roles)) return message.reply('Sorry, you\'re missing the required permission to run this command, need KICK_MEMBERS. :x:');
    sql.get(`SELECT gp.prefix, gz.casenumber, gz.mod_logs_enabled, gz.mod_logs_channel FROM guild_prefix as gp left join guild_moderation_settings as gz on gp.guildId = gz.guildId WHERE gp.guildId = '${message.guild.id}'`).then(row => {
        exports.run = (client, message, args) => {
            if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.channel.send("Sorry, you do not have permission to perform the antiraid command.");
            if (!message.guild.member(client.user).hasPermission('MANAGE_CHANNELS')) return message.reply('Sorry, i dont have the perms to do this cmd i need MANAGE_CHANNELS. :x:');
            if (!client.lockit) client.lockit = [];
            const time = args.join(' ');
            const validUnlocks = ['release', 'unlock', 'stop', 'off'];
            if (!time) return message.reply('You must set a duration for the lockdown in either hours, minutes or seconds');

            if (validUnlocks.includes(time)) {
                message.channel.overwritePermissions(message.guild.id, {
                    SEND_MESSAGES: true
                }).then(() => {
                    message.channel.send('Lockdown lifted.');
                    clearTimeout(client.lockit[message.channel.id]);
                    delete client.lockit[message.channel.id];
                }).catch(error => {
                    return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                });
            } else {
                message.channel.overwritePermissions(message.guild.id, {
                    SEND_MESSAGES: false
                }).then(() => {
                    message.channel.send(`Channel locked down for ${ms(ms(time), { long:true })}`).then(() => {

                        client.lockit[message.channel.id] = setTimeout(() => {
                            message.channel.overwritePermissions(message.guild.id, {
                                SEND_MESSAGES: true
                            }).then(message.channel.send('Lockdown lifted.'))
                            delete client.lockit[message.channel.id];
                        }, ms(time));
                    }).catch(error => {
                        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                    });
                });
            }
        }

    })
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'lockdown',
    description: 'Allows you to disable messages being sent in the guild.',
    usage: 'lockdown @User [reason]'
};