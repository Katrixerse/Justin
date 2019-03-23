const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD", false, true, true)) return message.reply('Sorry, you\'re missing the required permission to run this command, need BAN_MEMBERS. :x:');
    if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) return message.reply('Sorry, i dont have the perms to do this cmd i need MANAGE_ROLES. :x:')
    sql.get(`SELECT gp.prefix, gz.casenumber, gz.mod_logs_enabled, gz.mod_logs_channel, gj.auto_roles, gj.auto_role_enabled FROM guild_prefix as gp left join guild_moderation_settings as gz on gp.guildId = gz.guildId left join guild_autorole_antijoin_settings as gj on gp.guildId = gj.guildId WHERE gp.guildId = '${message.guild.id}'`).then(row => {
        const prefixtouse = row.prefix
        const autorolerole = row.auto_roles
        const autoroleenabled = row.auto_role_enabled
        const embed10 = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setThumbnail(client.user.avatarURL)
            .setTitle("Command: " + prefixtouse + "autorole")
            .addField("Usage", prefixtouse + "autorole [enable/disable] [role name]")
            .addField("Example", prefixtouse + "autorole enable Members")
            .setDescription("Description: " + "Enables/disables auto role on join.");

        const helpembed = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .addField('Which option would you like to change?', '```\n[1] - Enable autorole\n[2] - Disable autorole\n[3] - Add a role\n[4] - Remove all roles\n\n# Type the number to see the page.\n# Type exit to leave this menu.```')
        message.channel.send(helpembed)
            .then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                    .then((resp) => {
                        if (!resp) return;
                        resp = resp.array()[0];
                        if (resp.content === "1") {
                            if (autoroleenabled === "enabled") return message.channel.send("Auto role is already enabled is this guild. :x:")
                            sql.run(`UPDATE guild_autorole_antijoin_settings SET auto_role_enabled = "enabled" WHERE guildId = ${message.guild.id}`);
                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                            const embed = new Discord.RichEmbed()
                                .setColor(0x6B363E)
                                .setTitle("Case #" + row.casenumber + " | Action:  Auto Role Enabled")
                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                .addField("Role to give", autorolerole, true)
                                .setFooter("Time used: " + message.createdAt.toDateString())

                            if (!modlog) return;
                            if (row.mod_logs_enabled === "disabled") return;
                            client.channels.get(modlog.id).send({
                                embed
                            });
                            message.channel.send("Members will now get the role " + autorolerole + " when they join the guild from now on.")
                        } else if (resp.content === "2") {
                            if (autoroleenabled === "disabled") return message.channel.send("Auto role is already disabled in this guild. :x:")
                            sql.run(`UPDATE guild_autorole_antijoin_settings SET auto_role_enabled = "disabled" WHERE guildId = ${message.guild.id}`);
                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                            const embed = new Discord.RichEmbed()
                                .setColor(0x6B363E)
                                .setTitle("Case #" + row.casenumber + " | Action:  Auto Role Disabled")
                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                .setFooter("Time used: " + message.createdAt.toDateString())

                            if (!modlog) return;
                            if (row.mod_logs_enabled === "disabled") return;
                            client.channels.get(modlog.id).send({
                                embed
                            });
                            if (autorolerole === "none") {
                                message.channel.send("Autorole has been disabled for this guild.")
                            } else {
                                message.channel.send("Members will no longer get the role " + autorolerole + " when they join the guild from now on.")
                            }
                        } else if (resp.content === "3") {
                            const helpembed = new Discord.RichEmbed()
                                .setColor(0x6B363E)
                                .addField('Which role would you like members to get when they join?', '```\n[rolename] - Set role to give\n\n# Type exit to leave this menu.```')
                            message.channel.send(helpembed)
                                .then(() => {
                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time'],
                                        })
                                        .then((resp) => {
                                            if (!resp) return;
                                            resp = resp.array()[0];
                                            if (resp.content === "exit") {
                                                message.channel.send("Cancelled auto-role command.")
                                            } else {
                                                let roletogive = resp
                                                const roletogivefix = roletogive.content.replace(/[^\x00-\x7F]/g, "");
                                                if (roletogive.length < 1) return message.channel.send(usage)
                                                let muteRole = client.guilds.get(message.guild.id).roles.find(role => role.name == roletogivefix);
                                                if (!muteRole) return message.channel.send(" I can not find a role named " + roletogivefix + " :x:");
                                                if (muteRole.position >= message.guild.member(client.user).highestRole.position) return message.reply(`Can't give roles that are the same level as me or higher. :x:`);
                                                sql.run(`UPDATE guild_autorole_antijoin_settings SET auto_roles = "${row.auto_roles}, ${roletogivefix}" WHERE guildId = ${message.guild.id}`);
                                                message.channel.send(`The role(s): ${row.auto_roles} will now be givin when a user joins the server.`)
                                                let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                                                const embed = new Discord.RichEmbed()
                                                    .setColor(0x6B363E)
                                                    .setTitle("Case #" + row.casenumber + " | Action:  Role For Auto Role Changed")
                                                    .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                    .addField("Role to give", roletogivefix, true)
                                                    .setFooter("Time used: " + message.createdAt.toDateString())

                                                if (!modlog) return;
                                                if (row.mod_logs_enabled === "disabled") return;
                                                return client.channels.get(modlog.id).send({
                                                    embed
                                                });
                                            }
                                        })
                                        .catch(() => {});
                                })
                        } else if (resp.content === "4") {
                            message.channel.send(helpembed)
                                .then(() => {
                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time'],
                                        })
                                        .then((resp) => {
                                            if (!resp) return;
                                            resp = resp.array()[0];
                                            if (resp.content === "yes") {
                                                sql.run(`UPDATE guild_autorole_antijoin_settings SET auto_roles = "no-roles-set" WHERE guildId = ${message.guild.id}`);
                                            } else {
                                                message.channel.send("Cancelled auto-role command.")
                                            }
                                        }).catch(() => {});
                                })
                        }
                    })
            })
    })
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'auto-role',
    description: 'Allows the bot to give role(s) once someone joins.',
    usage: 'auto-role'
};