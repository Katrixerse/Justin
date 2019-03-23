const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
module.exports = (client, member, guild) => {
    if (member.user.bot) return;
    sql.get(`SELECT hz.wl_enabled, hz.wl_dm_enabled, hz.welcome_message, hz.wl_channel, hy.role_persist_enabled, hf.guild_pass_enabled, hf.guild_password, hf.password_uses, hf.password_role FROM guild_wl_system as hz left join guild_misc_settings as hy on hy.guildId = hz.guildId left join guild_pass_settings as hf on hf.guildId = hz.guildId WHERE hz.guildId ="${member.guild.id}"`).then(async row => {
        if (!row) return
        if (row.guild_pass_enabled === "enabled") {
            await Guild_pass(row);
            if (row.wl_enabled === "enabled") {
                Welcome_leave(row);
            }
            if (row.role_persist_enabled === "enabled") {
                Role_persist();
            }
        } else {
            if (row.wl_enabled === "enabled") {
                Welcome_leave(row);
            }
            if (row.role_persist_enabled === "enabled") {
                Role_persist();
            }
        }
    })

    function Guild_pass(row) {
        member.user.send('```Please enter the server password?\n\n# Type the password.\n# Type exit to leave this menu.```')
            .then(() => {
                member.user.dmChannel.awaitMessages(m => m.id === member.user.id, {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                    .then((resp) => {
                        if (!resp) return;
                        resp = resp.array()[0];
                        if (row.guild_password === resp.content) {
                            if (row.password_uses > 0) {
                                let role = client.guilds.get(message.guild.id).roles.find(role => role.name === row.password_role);
                                if (!role) return message.channel.send(`Could not find the role: ${row.password_role}, please contact the guild owner.`)
                                member.guild.member(member.user.id).addRole(row.password_role);
                                if (row.password_uses !== 0) {
                                    sql.get(`SELECT password_uses FROM guild_pass_settings WHERE guildId = "${member.guild.id}"`).then(row2 => {
                                        sql.run(`UPDATE guild_pass_settings SET password_uses = ${row2.password_uses -= 1} WHERE guildId = ${message.guild.id}`);
                                        member.user.send(`Password is correct, you have been given the role: ${row.password_role} and can now access the guild.`);
                                    })
                                }
                            }
                        }
                    }).catch((err) => {
                        if (err.message === undefined) {
                            member.user.send('You provided no input in the time limit, please try again.');
                        } else {
                            console.log(err)
                            return mmember.user.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                        }
                    });
            }).catch((err) => {
                if (err.message === undefined) {
                    member.user.send('You provided no input in the time limit, please try again.');
                } else {
                    console.log(err)
                    return member.user.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                }
            });
    }

    function Welcome_leave(row) {
        if (row.wl_dm_enabled === "enabled") {
            try {
                if (row.wl_enabled === "enabled") {
                    let WelcomeMess = row.welcome_message;
                    var WelcomeFix = WelcomeMess.replace("%user.mention%", "<@" + member.user.id + ">").replace("%server.name%", member.guild.name).replace("%user.name%", member.user.username).replace("%server.memberCount%", member.guild.memberCount);
                    return member.user.send(WelcomeFix);
                }
            } catch (err) {
                console.log(err)
            }
        } else {
            try {
                if (row.wl_enabled === "enabled") {
                    const welcomeChannel = member.guild.channels.find(n => n.name === row.wl_channel);
                    if (!welcomeChannel) return;
                    let WelcomeMess = row.welcome_message;
                    var WelcomeFix = WelcomeMess.replace("%user.mention%", "<@" + member.user.id + ">").replace("%server.name%", member.guild.name).replace("%user.name%", member.user.username).replace("%server.memberCount%", member.guild.memberCount);
                    return client.channels.get(welcomeChannel.id).send(WelcomeFix);
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    function Role_persist() {
        try {
            sql.get(`SELECT * FROM user_roles WHERE guildId = "${member.guild.id}" AND userId ="${member.user.id}"`).then(async row2 => {
                var a = row2.roles.split(" ")
                a.forEach(u => {
                    let subscriberRole = client.guilds.get(member.guild.id).roles.find(n => n.name === u);
                    if (!subscriberRole) return;
                    if (subscriberRole.position >= member.guild.member(client.user).highestRole.position) return;
                    member.guild.member(member.user.id).addRole(subscriberRole)
                })
            })
        } catch (err) {
            console.log(err)
        }
    }
}