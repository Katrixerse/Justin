const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("BAN_MEMBERS", false, true, true)) return message.reply('Sorry, you\'re missing the required permission to use this command you need BAN_MEMBERS. :x:');
    sql.get(`SELECT gp.prefix, gz.casenumber, gz.mod_logs_enabled, gz.mod_logs_channel FROM guild_prefix as gp left join guild_moderation_settings as gz on gp.guildId = gz.guildId WHERE gp.guildId = '${message.guild.id}'`).then(row => {
        const prefixtouse = row.prefix
        const usage = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setThumbnail(client.user.avatarURL)
            .setTitle("Command: " + prefixtouse + "unban")
            .addField("Usage", prefixtouse + "unban <ID> <reason>")
            .addField("Example", prefixtouse + "unban 130515926117253122 I forgive them.")
            .setDescription("Description: " + "Unbans a user from the current server");

        if (!message.guild.member(client.user).hasPermission('BAN_MEMBERS')) return message.reply('Sorry, I dont have the permission to do this command I need BAN_MEMBERS. :x:');
        let user = args[0];
        if (user > 1) {
            if (isNaN(user)) return message.channel.send(usage);
            if (user === message.author.id) return message.channel.send(`:x: Well no you can't unban yourself`);
            let unban_reason = args.slice(1).join(' ') || `Moderator didn't give a reason.`;
            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
            message.guild.fetchBans().then(users => {
                let banned_ids = users.map(user => user.id)
                if (!banned_ids.includes(user_Id)) {
                    return message.channel.send(`User ID: ${user_Id} isn't banned from the server, can't unban them.`);
                } else {
                    message.guild.unban(user, {
                        reason: unban_reason
                    }).then(user => console.log(`Unbanned ${user.username} from ${message.guild.name}`));
                    sql.run(`UPDATE guild_moderation_settings SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
                    const embed = new Discord.RichEmbed()
                        .setColor(0x6B363E)
                        .setTitle("Case #" + row.casenumber + " | Action: Unban")
                        .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                        .addField("ID:", user)
                        .addField("Reason", unban_reason, true)
                        .setFooter("Time used: " + message.createdAt.toDateString())
                    message.channel.send("User has been unbanned from the server")
                    if (!modlog) return;
                    if (row.mod_logs_enabled === "disabled") return;
                    return client.channels.get(modlog.id).send(embed);
                }
            })
        } else {
            message.channel.send('```Which ID would you like to unban from the server?\n\n# Type the ID of the user.\n# Type exit to leave this menu.```')
                .then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        })
                        .then((resp) => {
                            if (!resp) return;
                            let user_Id = resp.first().content;
                            message.guild.fetchBans().then(users => {
                                let banned_ids = users.map(user => user.id)
                                if (!banned_ids.includes(user_Id)) {
                                    return message.channel.send(`User ID: ${user_Id} isn't banned from the server, can't unban them.`);
                                } else {
                                    if (user_Id === message.author.id) return message.channel.send(`:x: Well no you can't unban yourself`);
                                    let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                                    message.channel.send('```Why would you like to unban this user?\n\n# Type 1 for no reason or type the reason for the unban.\n# Type exit to leave this menu.```')
                                        .then(() => {
                                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ['time'],
                                                })
                                                .then((resp2) => {
                                                    if (!resp2) return;
                                                    resp2 = resp2.array()[0];
                                                    if (resp2.content === '1') {
                                                        unban_reason = 'Moderator didn\'t provide a reason.'
                                                        if (message.guild.members.get(user_Id)) return message.channel.send(`UserID: ${user_Id} is not currently banned from the server.`);
                                                        message.guild.unban(user_Id, `${unban_reason}`);
                                                        sql.run(`UPDATE guild_moderation_settings SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
                                                        const embed = new Discord.RichEmbed()
                                                            .setColor(0x6B363E)
                                                            .setTitle("Case #" + row.casenumber + " | Action: Unban")
                                                            .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                            .addField("ID:", user_Id)
                                                            .addField("Reason", unban_reason, true)
                                                            .setFooter("Time used: " + message.createdAt.toDateString())
                                                        message.channel.send(`The user ID: ${user_Id} has been successfully unbanned from the server.`);
                                                        if (!modlog) return;
                                                        if (row.mod_logs_enabled === "disabled") return;
                                                        return client.channels.get(modlog.id).send(embed);
                                                    } else {
                                                        reason = resp2.content;
                                                        if (message.guild.members.get(user_Id)) return message.channel.send(`UserID: ${user_Id} is not currently banned from the server.`);
                                                        message.guild.unban(user_Id, `${unban_reason}`);
                                                        sql.run(`UPDATE guild_moderation_settings SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
                                                        const embed = new Discord.RichEmbed()
                                                            .setColor(0x6B363E)
                                                            .setTitle("Case #" + row.casenumber + " | Action: Unban")
                                                            .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                            .addField("ID:", user_Id)
                                                            .addField("Reason", unban_reason, true)
                                                            .setFooter("Time used: " + message.createdAt.toDateString())
                                                        message.channel.send(`The user ID: ${user_Id} has been successfully unbanned from the server.`);
                                                        if (!modlog) return;
                                                        if (row.mod_logs_enabled === "disabled") return;
                                                        client.channels.get(modlog.id).send(embed)
                                                    }
                                                }).catch((err) => {
                                                    if (err.message === undefined) {
                                                        message.channel.send('You provided no input in the time limit, please try again.')
                                                    } else {
                                                        console.log(err)
                                                        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                                    }
                                                });
                                        }).catch((err) => {
                                            if (err.message === undefined) {
                                                message.channel.send('You provided no input in the time limit, please try again.')
                                            } else {
                                                console.log(err)
                                                return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                            }
                                        });
                                }
                            }).catch((err) => {
                                if (err.message === undefined) {
                                    message.channel.send('You provided no input in the time limit, please try again.')
                                } else {
                                    console.log(err)
                                    return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                }
                            });
                        });
                }).catch((err) => {
                    if (err.message === undefined) {
                        message.channel.send('You provided no input in the time limit, please try again.')
                    } else {
                        console.log(err)
                        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                    }
                });
        }
    })
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'unban',
    description: 'Unbans a user from the server.',
    usage: 'unban'
};