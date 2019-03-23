const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD", false, true, true)) return message.channel.send("You're missing MANAGE_GUILD permission");
    if (!message.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) return message.reply('Sorry, I dont have the perms to do this cmd i need MANAGE_MESSAGES. :x:')
    sql.get(`SELECT casenumber, mod_logs_enabled, mod_logs_channel FROM guild_moderation_settings WHERE guildId = '${message.guild.id}'`).then(row => {

        message.channel.send('```Which Option would you like to use?\n\n[1] - Enable auto-mod feature.\n[2] - Disable auto-mod feature.\n[3] - Manage anti-swear words\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
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
                            message.channel.send('Which auto-mod feature would you like to enable? \n[Options: all, anti-invite, anti-web, anti-spam, anti-swear]').then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 30000,
                                        errors: ['time'],
                                    })
                                    .then((resp) => {
                                        if (!resp) return;
                                        resp = resp.array()[0];
                                        if (resp.content === 'all') {
                                            sql.run(`UPDATE guild_amod_settings SET automod_enabled = "enabled", anti_invite_enabled = "enabled", anti_weblink_enabled = "enabled", anti_dup_char_enabled = "enabled", anti_swear_enabled = "enabled" WHERE guildId = ${message.guild.id}`);
                                            message.channel.send("Auto moderation with all tools has been enabled for this guild.")
                                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                                            const embed = new Discord.RichEmbed()
                                                .setColor(0x00A2E8)
                                                .setTitle("Case #" + row.casenumber + " | Action:  Auto Mod Enabled")
                                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                .addField("Auto Mod Tool", "All")
                                                .setFooter("Time used: " + message.createdAt.toDateString());
                                            if (!modlog) return;
                                            if (row.mod_logs_enabled === "disabled") return;
                                            client.channels.get(modlog.id).send(embed);
                                        } else if (resp.content === 'anti-ivnite') {
                                            sql.run(`UPDATE guild_amod_settings SET automod_enabled = "enabled", anti_invite_enabled = "enabled" WHERE guildId = ${message.guild.id}`);
                                            message.channel.send("Auto moderation with anti invite is has been enabled for this guild.")
                                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                                            const embed = new Discord.RichEmbed()
                                                .setColor(0x00A2E8)
                                                .setTitle("Case #" + row.casenumber + " | Action:  Auto Mod Enabled")
                                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                .addField("Auto Mod Tool", "Anti Invite")
                                                .setFooter("Time used: " + message.createdAt.toDateString());
                                            if (!modlog) return;
                                            if (row.mod_logs_enabled === "disabled") return;
                                            client.channels.get(modlog.id).send(embed);
                                        } else if (resp.content === 'anti-web') {
                                            sql.run(`UPDATE guild_amod_settings SET automod_enabled = "enabled", anti_weblink_enabled = "enabled" WHERE guildId = ${message.guild.id}`);
                                            message.channel.send("Auto moderation with anti website link is has been enabled for this guild.")
                                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                                            const embed = new Discord.RichEmbed()
                                                .setColor(0x00A2E8)
                                                .setTitle("Case #" + row.casenumber + " | Action:  Auto Mod Enabled")
                                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                .addField("Auto Mod Tool", "Anti Website Link")
                                                .setFooter("Time used: " + message.createdAt.toDateString())
                                            if (!modlog) return;
                                            if (row.mod_logs_enabled === "disabled") return;
                                            client.channels.get(modlog.id).send(embed);
                                        } else if (resp.content === 'anti-spam') {
                                            sql.run(`UPDATE guild_amod_settings SET automod_enabled = "enabled", anti_dup_char_enabled = "enabled" WHERE guildId = ${message.guild.id}`);
                                            message.channel.send("Auto moderation with anti duplicate characters is has been enabled for this guild.")
                                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                                            const embed = new Discord.RichEmbed()
                                                .setColor(0x00A2E8)
                                                .setTitle("Case #" + row.casenumber + " | Action:  Auto Mod Enabled")
                                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                .addField("Auto Mod Tool", "Anti Duplicate Characters")
                                                .setFooter("Time used: " + message.createdAt.toDateString());
                                            if (!modlog) return;
                                            if (row.mod_logs_enabled === "disabled") return;
                                            client.channels.get(modlog.id).send(embed);
                                        } else if (resp.content === 'anti-swear') {
                                            sql.run(`UPDATE guild_amod_settings SET automod_enabled = "enabled", anti_swear_enabled = "enabled" WHERE guildId = ${message.guild.id}`);
                                            message.channel.send("Auto moderation with anti swear has been enabled for this guild.")
                                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                                            const embed = new Discord.RichEmbed()
                                                .setColor(0x00A2E8)
                                                .setTitle("Case #" + row.casenumber + " | Action:  Auto Mod Enabled")
                                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                .addField("Auto Mod Tool", "Anti Swear")
                                                .setFooter("Time used: " + message.createdAt.toDateString());
                                            if (!modlog) return;
                                            if (row.mod_logs_enabled === "disabled") return;
                                            client.channels.get(modlog.id).send(embed);
                                        } else {
                                            message.channel.send('You provided no valid input in the time limit, please try again.')
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
                        } else if (resp.content === '2') {
                            message.channel.send('Which auto-mod feature would you like to disable? \n[Options: all, anti-invite, anti-web, anti-dub, anti-swear]').then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 30000,
                                        errors: ['time'],
                                    })
                                    .then((resp) => {
                                        if (!resp) return;
                                        resp = resp.array()[0];
                                        if (resp.content === 'all') {
                                            sql.run(`UPDATE guild_amod_settings SET automod_enabled = "disabled", anti_invite_enabled = "disabled", anti_weblink_enabled = "disabled", anti_dup_char_enabled = "disabled", anti_swear_enabled = "disabled" WHERE guildId = ${message.guild.id}`);
                                            message.channel.send("All auto moderation has been disabled for this guild.")
                                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                                            const embed = new Discord.RichEmbed()
                                                .setColor(0x00A2E8)
                                                .setTitle("Case #" + row.casenumber + " | Action:  Auto Mod Disabled")
                                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                .addField("Auto Mod Tool", "All")
                                                .setFooter("Time used: " + message.createdAt.toDateString())
                                            if (!modlog) return;
                                            if (row.mod_logs_enabled === "disabled") return;
                                            client.channels.get(modlog.id).send(embed);
                                        } else if (resp.content === 'anti-ivnite') {
                                            sql.run(`UPDATE guild_amod_settings SET automod_enabled = "enabled", anti_invite_enabled = "disabled" WHERE guildId = ${message.guild.id}`);
                                            message.channel.send("Anit invite has been disabled for this guild.")
                                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                                            const embed = new Discord.RichEmbed()
                                                .setColor(0x00A2E8)
                                                .setTitle("Case #" + row.casenumber + " | Action:  Auto Mod Disabled")
                                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                .addField("Auto Mod Tool", "Anti Invite")
                                                .setFooter("Time used: " + message.createdAt.toDateString())
                                            if (!modlog) return;
                                            if (row.mod_logs_enabled === "disabled") return;
                                            client.channels.get(modlog.id).send(embed);
                                        } else if (resp.content === 'anti-web') {
                                            sql.run(`UPDATE guild_amod_settings SET automod_enabled = "enabled", anti_dup_char_enabled = "disabled" WHERE guildId = ${message.guild.id}`);
                                            message.channel.send("Anit duplicate characters has been disabled for this guild.")
                                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                                            const embed = new Discord.RichEmbed()
                                                .setColor(0x00A2E8)
                                                .setTitle("Case #" + row.casenumber + " | Action:  Auto Mod Disabled")
                                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                .addField("Auto Mod Tool", "Anti Website link")
                                                .setFooter("Time used: " + message.createdAt.toDateString())
                                            if (!modlog) return;
                                            if (row.mod_logs_enabled === "disabled") return;
                                            client.channels.get(modlog.id).send(embed);
                                        } else if (resp.content === 'anti-spam') {
                                            sql.run(`UPDATE guild_amod_settings SET automod_enabled = "enabled", anti_dup_char_enabled = "disabled" WHERE guildId = ${message.guild.id}`);
                                            message.channel.send("Anit duplicate characters has been disabled for this guild.")
                                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                                            const embed = new Discord.RichEmbed()
                                                .setColor(0x00A2E8)
                                                .setTitle("Case #" + row.casenumber + " | Action:  Auto Mod Disabled")
                                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                .addField("Auto Mod Tool", "Anti Website link")
                                                .setFooter("Time used: " + message.createdAt.toDateString())
                                            if (!modlog) return;
                                            if (row.mod_logs_enabled === "disabled") return;
                                            client.channels.get(modlog.id).send(embed);
                                        } else if (resp.content === 'anti-swear') {
                                            sql.run(`UPDATE guild_amod_settings SET automod_enabled = "enabled", anti_swear_enabled = "disabled" WHERE guildId = ${message.guild.id}`);
                                            message.channel.send("Auto moderation with anti swear has been enabled for this guild.")
                                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                                            const embed = new Discord.RichEmbed()
                                                .setColor(0x00A2E8)
                                                .setTitle("Case #" + row.casenumber + " | Action:  Auto Mod Enabled")
                                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                .addField("Auto Mod Tool", "Anti Swear")
                                                .setFooter("Time used: " + message.createdAt.toDateString());
                                            if (!modlog) return;
                                            if (row.mod_logs_enabled === "disabled") return;
                                            client.channels.get(modlog.id).send(embed);
                                        } else {
                                            message.channel.send('You provided no valid input in the time limit, please try again.')
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
                        } else if (resp.content === '3') {
                            message.channel.send('```Which Option would you like to use?\n[1] - Add a word.\n[2] - Remove a word\n[3] - View list of words\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
                                .then(() => {
                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time'],
                                        })
                                        .then((resp) => {
                                            if (!resp) return;
                                            resp = resp.array()[0];
                                            if (resp.content === '1') {
                                                message.channel.send('```Which word would you like to add to the list?\n\n# Type exit to leave this menu.```')
                                                    .then(() => {
                                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                                max: 1,
                                                                time: 30000,
                                                                errors: ['time'],
                                                            })
                                                            .then((resp) => {
                                                                if (!resp) return;
                                                                resp = resp.array()[0];
                                                                sql.get(`SELECT * FROM guild_amod_settings WHERE guildId ="${message.guild.id}"`).then(row1 => {
                                                                    if (!row1) return;
                                                                    if (row1.anti_swear_words.includes(resp.content)) return message.channel.send(`Word is already on the list.`);
                                                                    if (row1.anti_swear_words.includes('no-words-to-filter')) {
                                                                        sql.run(`UPDATE guild_amod_settings SET anti_swear_words = "${resp.content}" WHERE guildId = ${message.guild.id}`);
                                                                        return message.channel.send('The word has been added to the list.');
                                                                    } else {
                                                                        sql.run(`UPDATE guild_amod_settings SET anti_swear_words = "${row1.anti_swear_words},${resp.content}" WHERE guildId = ${message.guild.id}`);
                                                                        return message.channel.send('The word has been added to the list.');
                                                                    }
                                                                })
                                                            })
                                                    })
                                            } else if (resp.content === '2') {
                                                message.channel.send('```Which word would you like to remove from the list or use all to remove all of them?\n\n# Type exit to leave this menu.```')
                                                    .then(() => {
                                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                                max: 1,
                                                                time: 30000,
                                                                errors: ['time'],
                                                            })
                                                            .then((resp) => {
                                                                if (!resp) return;
                                                                resp = resp.array()[0];
                                                                if (resp.content === 'all') {
                                                                    sql.run(`UPDATE guild_amod_settings SET anti_swear_words = "no-words-to-filter" WHERE guildId = ${message.guild.id}`);
                                                                    return message.channel.send('All words have been removed from the list.');
                                                                } else {
                                                                    sql.get(`SELECT * FROM guild_amod_settings WHERE guildId ="${message.guild.id}"`).then(row1 => {
                                                                        if (!row1) return;
                                                                        if (row1.anti_swear_words.includes(resp.content) === 'false') return message.channel.send(`Word is already not on the list.`);
                                                                        sql.run(`UPDATE guild_amod_settings SET anti_swear_words = "${row1.anti_swear_words.split(resp.content.toLowerCase() + ',').pop()}" WHERE guildId = ${message.guild.id}`);
                                                                        return message.channel.send('The word has been removed from the list.');
                                                                    })
                                                                }
                                                            })
                                                    })
                                            } else if (resp.content === '3') {
                                                sql.get(`SELECT * FROM guild_amod_settings WHERE guildId ="${message.guild.id}"`).then(row1 => {
                                                    message.channel.send(`All unallowed words: ${row1.anti_swear_words}`);
                                                })
                                            } else if (resp.content === 'exit') {
                                                return message.channel.send('Command has been cancelled.');
                                            }
                                        }).catch((err) => {
                                            if (err.message === undefined) {
                                                message.channel.send('You provided no input in the time limit, please try again.');
                                            } else {
                                                console.log(err)
                                                return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                            }
                                        });
                                }).catch((err) => {
                                    if (err.message === undefined) {
                                        message.channel.send('You provided no input in the time limit, please try again.');
                                    } else {
                                        console.log(err)
                                        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                    }
                                });
                        } else {
                            message.channel.send('You provided no input in the time limit, please try again.');
                        }
                    }).catch((err) => {
                        if (err.message === undefined) {
                            message.channel.send('You provided no input in the time limit, please try again.');
                        } else {
                            console.log(err)
                            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                        }
                    });
            }).catch((err) => {
                if (err.message === undefined) {
                    message.channel.send('You provided no input in the time limit, please try again.');
                } else {
                    console.log(err)
                    return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                }
            });
    }).catch((err) => {
        if (err.message === undefined) {
            message.channel.send('You provided no input in the time limit, please try again.');
        } else {
            console.log(err)
            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    });
}




exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'auto-mod',
    description: 'Allows you to edit the auto mod options.',
    usage: 'auto-mod [enable/disable] [antiinvite/antiweblink/antidupchars]'
};