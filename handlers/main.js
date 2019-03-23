const Discord = require('discord.js');
const sql = require('sqlite');
sql.open(`./assets/db/botsdb.sqlite`);
module.exports = {
    prefix_reset: (message) => {
        if (message.member.hasPermission("MANAGE_GUILD", false, true, true) || message.author.id === "130515926117253122") {
            message.channel.send('What would you like the new prefix to be?').then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                    .then((resp) => {
                        if (!resp) return;
                        resp = resp.array()[0];
                        if (resp.content === "exit") {
                            return message.channel.send('Prefix command has been cancelled.')
                        } else {
                            const newprefix = resp.content;
                            if (newprefix < 1) return message.channel.send("Didn't provide a new prefix to set.");
                            if (newprefix.length > 5) return message.channel.send("The new prefix can't be longer than 5 characters.");
                            const newprefixfix = newprefix.replace("[^\\x00-\\x7F]", "").replace('/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g,', '').replace("``", "").replace("**", "").replace('""', '');
                            if (newprefixfix.length < 1) return message.channel.send("Prefix can't have ascii characters")
                            sql.get(`SELECT prefix FROM guild_prefix WHERE guildId ="${message.guild.id}"`).then(row => {
                                sql.run(`UPDATE guild_prefix SET prefix = "${newprefixfix}" WHERE guildId = ${message.guild.id}`);
                                message.channel.send("I have set the new guild prefix to " + newprefix)
                                let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
                                const embed = new Discord.RichEmbed()
                                    .setColor(0x6B363E)
                                    //.setTitle("Case #" + row.casenumber + " | Action: Prefix Change")
                                    .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                    .addField("New prefix", newprefixfix, true)
                                    .setFooter("Time used: " + message.createdAt.toDateString());
                                if (!modlog) return;
                                if (row.logsenabled === "disabled") return;
                                return client.channels.get(modlog.id).send({
                                    embed
                                });
                            })
                        }
                    })
            })
        } else {
            message.channel.send('Seems you don\'t have the required permission: MANAGE_GUILD to use this command.');
        }
    },
    custom_commands: (message) => {
        sql.all(`SELECT command_name, command_output FROM guild_custom_commands WHERE guildId ="${message.guild.id}"`).then(rows => {
            rows.forEach(async function (row) {
                const command_fix = row.command_name.toLowerCase().replace('\\u', '')
                if (message.content.toLowerCase() === `${prefix}${command_fix.trim()}`) {
                    const find_cc_required_role = message.member.roles.map(r => r.name).join(" ")
                    const cc_output = row.command_output;
                    let cc = cc_output.replace("%author.mention%", `<@${message.author.id}>`)
                        .replace("%author.name%", message.author.username)
                        .replace('%response.delete%', '')
                        .replace('%server.id%', message.guild.id)
                        .replace("server.name%", message.guild.name)
                        .replace("%server.memberCount%", message.guild.memberCount)
                        .replace('%server.ownerID%', message.guild.ownerID)
                        .replace('%server.createdAt%', message.guild.createdAt)
                        .replace('%server.region%', message.guild.region)
                        // channel placeholders
                        .replace('%channel.id%', message.channel.id)
                        .replace('%channel.name%', message.channel.name)
                        .replace('%channel.mention%', `<#${message.channel.id}>`)
                        // advanced place-holders
                        .replace('%prefix%', prefix)
                    if (cc_output.includes(`%require-r:`)) {
                        var a = find_cc_required_role.split(" ");
                        a.forEach(async u => {
                            if (cc_output.includes(`%require-r:${u}%`)) {
                                const cc_fix = cc_output.replace(`%require-r:${u}%`, '');
                                const msg = await message.channel.send(cc_fix);
                                console.log('A user used a custom command named: ' + row.command_name);
                                if (cc_output.includes('%reponse.delete%')) {
                                    msg.delete(6000)
                                }
                            }
                        })
                    } else {
                        const msg = await message.channel.send(cc);
                        console.log('A user used a custom command named: ' + row.command_name);
                        if (cc_output.includes('%reponse.delete%')) {
                            msg.delete(6000)
                        }
                    }
                }
            })
        })
    },
    profile_system: (message) => {
        sql.get(`SELECT profiles_enabled, leveling_enabled, gambling_enabled FROM guild_misc_settings WHERE guildId ="${message.guild.id}"`).then(row2 => {
            if (!row2) return;
            if (row2.profiles_enabled === "disabled" || row2.leveling_enabled === "disabled" || row2.gambling_enabled === "disabled") return;
        })
        const xpgained = Math.floor(Math.random() * 35) + 1;
        const moneygained = Math.floor(Math.random() * 200) + 1;
        sql.get(`SELECT * FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(async row => {
            if (!row) {
                sql.run("INSERT INTO user_profiles (guildId, userId, xp, level, bank, cash, awards, rep, username, winningchance, rank, JAC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [message.guild.id, message.author.id, 0, 1, 0, 100, "None", 0, `${message.author.username}`, 0, "Member", "false"]);
            } else {
                if (row.JAC === 'true') return;
                let curxp = row.xp;
                let curlvl = row.level;
                let nxtlvl = row.level * 600;
                if (nxtlvl <= row.xp) {
                    row.level = curlvl + 1;
                    if (row.level >= 200) return;
                    sql.run(`UPDATE user_profiles SET xp = ${row.xp + xpgained}, level = ${row.level} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    let fixedcurlvl = parseInt(curlvl)
                    const usersusername = message.author.username
                    const usersusernamefix = usersusername.substr(0, 11);
                    if (curxp.length + 1 >= nxtlvl.length) return;
                    const {
                        Canvas
                    } = require('canvas-constructor');
                    const getSlapped = async (person) => {
                        const plate = await fsn.readFile('./assets/images/newlevelcard.png');
                        const png = person.replace('.gif', '.png');
                        const {
                            body
                        } = await request.get(png);
                        return new Canvas(250, 261)
                            .addImage(plate, 0, 0, 250, 261)
                            .setTextFont('32px Impact')
                            .setTextAlign("center")
                            .addText(usersusernamefix, 125, 73)
                            .setTextFont('76px Impact')
                            .addText(fixedcurlvl + 1, 125, 216)
                            .toBuffer();
                    }
                    try {
                        const person = message.author.avatarURL;
                        const result = await getSlapped(person);
                        await message.channel.send({
                            files: [{
                                attachment: result,
                                name: 'levelup.png'
                            }]
                        }).then(msg => msg.delete(25000));
                    } catch (error) {
                        throw error;
                    }
                }
                if (row.xp >= 9999999 || row.cash >= 999999999999) return;
                const username = message.author.username;
                const usernamefix = username.replace(/"/gi, "")
                sql.run(`UPDATE user_profiles SET xp = ${row.xp + xpgained}, cash = ${row.cash + moneygained}, username = "${usernamefix}" WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`);
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    talkedRecently.delete(message.author.id);
                }, 60000);
            }
        }).catch(() => {
            sql.run("CREATE TABLE IF NOT EXISTS user_profiles (guildId TEXT, userId TEXT, xp INTEGER, level INTEGER, bank INTEGER, cash INTEGER, awards TEXT, rep INTEGER, username TEXT, winningchance INTEGER, rank TEXT, JAC TEXT)").then(() => {
                sql.run("INSERT INTO user_profiles (guildId, userId, xp, level, bank, cash, awards, rep, username, winningchance, rank, JAC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [message.guild.id, message.author.id, 0, 1, 0, 100, "None", 0, `${message.author.username}`, 0, "Member", "false"]);
            })
        })
    },
    anti_invite: (message, row) => {
        if (automod_enabled === "disabled") return;
        if (row.anti_invite_enabled === "disabled") return;
        if (message.member.hasPermission("KICK_MEMBERS", false, true, true) || message.member.roles.map((e) => e).join(',').toString().includes(row.mod_roles)) return;
        message.delete()
        let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
        const embed = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setTitle("Action: Auto Moderation")
            .addField("Moderator", `${client.user.username} (ID ${client.user.id})`)
            .addField("User", `${message.author.username} (ID: ${message.author.id})`)
            .addField("In channel", message.channel.name, true)
            .addField("Reason", "Invite Link", true)
            .addField("Invite link", message.cleanContent)
            .setFooter("Time used: " + message.createdAt.toDateString())
        if (!modlog) return;
        if (row.mod_logs_enabled === "disabled") return;
        client.channels.get(modlog.id).send(embed);
        message.reply(" not allowed to post invite links.").then((response) => {
            response.delete(6000);
        });
    },
    anti_web_link: (message, row) => {
        if (automod_enabled === "disabled") return;
        if (row.anti_weblink_enabled === "disabled") return;
        if (message.member.hasPermission("KICK_MEMBERS", false, true, true) || message.member.roles.map((e) => e).join(',').toString().includes(row.mod_roles)) return;
        message.delete()
        let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
        const embed = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setTitle("Action: Auto Moderation")
            .addField("Moderator", `${client.user.username} (ID ${client.user.id})`)
            .addField("User", `${message.author.username} (ID: ${message.author.id})`)
            .addField("In channel", message.channel.name, true)
            .addField("Reason", "Website Link", true)
            .addField("Website link", message.cleanContent)
            .setFooter("Time used: " + message.createdAt.toDateString())
        if (!modlog) return;
        if (row.mod_logs_enabled === "disabled") return;
        client.channels.get(modlog.id).send(embed);
        message.reply(" not allowed to post website links.").then((response) => {
            response.delete(6000);
        });
    },
    anti_dup_char: (message, row) => {
        if (automod_enabled === "disabled") return;
        if (row.anti_dup_char_enabled === "disabled") return;
        if (message.member.hasPermission("KICK_MEMBERS", false, true, true) || message.member.roles.map((e) => e).join(',').toString().includes(row.mod_roles)) return;
        const check1 = message.content.toLowerCase();
        if (check1.includes('.')) return;
        var hasDuplicates = /([a-zA-Z])\1+$/;
        const result = hasDuplicates.test(check1)
        if (result === true) {
            message.delete()
            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
            const embed = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTitle("Action: Auto Moderation")
                .addField("Moderator", `${client.user.username} (ID ${client.user.id})`)
                .addField("User", `${message.author.username} (ID: ${message.author.id})`)
                .addField("In channel", message.channel.name, true)
                .addField("Reason", "Duplicated Characters", true)
                .addField("Message Content", message.cleanContent)
                .setFooter("Time used: " + message.createdAt.toDateString())
            if (!modlog) return;
            if (row.mod_logs_enabled === "disabled") return;
            client.channels.get(modlog.id).send(embed);
            let user = message.guild.member(message.mentions.users.first())
            message.reply(" message contains duplicated characters.").then((response) => {
                response.delete(6000);
            });
        }
    },
    anti_swear: (message) => {
        if (automod_enabled === "disabled") return;
        if (row.anti_swear_enabled === "disabled") return;
        if (message.member.hasPermission("KICK_MEMBERS", false, true, true) || message.member.roles.map((e) => e).join(',').toString().includes(row.mod_roles)) return;
        message.delete()
        let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
        const embed = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setTitle("Action: Auto Moderation")
            .addField("Moderator", `${client.user.username} (ID ${client.user.id})`)
            .addField("User", `${message.author.username} (ID: ${message.author.id})`)
            .addField("In channel", message.channel.name, true)
            .addField("Reason", "Anti Swear", true)
            .addField("Swear word", message.cleanContent)
            .setFooter("Time used: " + message.createdAt.toDateString());
        if (!modlog) return;
        if (row.mod_logs_enabled === "disabled") return;
        client.channels.get(modlog.id).send(embed);
        message.reply(" no swearing allowed.").then((response) => {
            response.delete(6000);
        });
    },
    afk_system: () => {
        if (message.mentions.members.first()) {
            const user = message.mentions.members.first()
            if (user.id === message.author.id) return;
            sql.get(`SELECT * FROM user_afk WHERE guildId ="${message.guild.id}" and userId ="${user.id}"`).then(row3 => {
                if (!row3) return;
                if (row3.isAfk == `yes`) {
                    message.channel.send(`***${message.mentions.members.first().user.username} is afk: ${row3.whyisAfk}.***`);
                };
            });
        }
        sql.get(`SELECT * FROM user_afk WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row1 => {
            if (!row1) return;
            if (row1.isAfk == `yes`) {
                message.channel.send(`***Welcome back ${message.author.username}, I removed your AFK!***`);
                sql.run(`UPDATE user_afk SET isAfk = "no", whyisAfk = "none" WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
                if (message.member.roles.size > 0 && message.member.highestRole.position < message.guild.me.highestRole.position) {
                    if (!message.guild.member(client.user).hasPermission('MANAGE_NICKNAMES')) return;
                    if (message.member.highestRole.position >= message.guild.member(client.user).highestRole.position) return;
                    let usernick = message.member.displayName;
                    if (usernick.includes('[AFK]')) {
                        let nicknametrim = usernick.split('[AFK]').pop().trimLeft();
                        message.member.setNickname(`${nicknametrim}`);
                    }
                }
            }
        })
    }
}