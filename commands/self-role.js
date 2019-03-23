const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    message.channel.send('```Which Option would you like to use?\n\n[1] - Get role.\n[2] - Manage self assignable roles [ADMIN]\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
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
                        message.channel.send('```What role would you like?\n\nType the roles name.\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
                            .then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 30000,
                                        errors: ['time'],
                                    })
                                    .then((resp) => {
                                        if (!resp) return;
                                        resp = resp.array()[0];
                                        let role_name = resp.content;
                                        let role = client.guilds.get(message.guild.id).roles.find(role => role.name === role_name);
                                        if (!role) return message.channel.send(`${role_name} is not a valid role in this guild.`)
                                        sql.get(`SELECT self_role_enabled, self_roles FROM guild_self_roles WHERE guildId ="${message.guild.id}"`).then(row => {
                                            if (row.self_role_enabled === 'enabled') {
                                                if (row.self_roles.includes(`${role_name}`)) {
                                                    let user = message.author.id
                                                    message.guild.member(user).addRole(role);
                                                    message.channel.send("***" + role + " has been successfully added! :white_check_mark:***");
                                                } else {
                                                    message.channel.send('Self role has been disabled in this guild.');
                                                }
                                            } else {
                                                message.channel.send(`Didn't find role: ${role_name} in the self assignable role list.`);
                                            }
                                        })
                                    })
                            })
                    } else if (resp.content === '2') {
                        if (!message.member.hasPermission("MANAGE_ROLES", false, true, true)) return message.reply('Sorry, you\'re missing the required permission to use this command you need MANAGE_ROLES. :x:');
                        message.channel.send('```Which Option would you like to use?\n\n[1] - Add role.\n[2] - Remove role.\n[3] - Enable/Disable selfrole.\n[4] - View roles\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
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
                                            message.channel.send('```Which role would you like to add?\n\nType the role name.\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
                                                .then(() => {
                                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                            max: 1,
                                                            time: 30000,
                                                            errors: ['time'],
                                                        })
                                                        .then((resp) => {
                                                            if (!resp) return;
                                                            resp = resp.array()[0];
                                                            let role_name = resp.content;
                                                            if (role_name.length > 25) return message.channel.send('Can only add roles that are 25 characters or less.');
                                                            let role = client.guilds.get(message.guild.id).roles.find(role => role.name === role_name);
                                                            if (!role) return message.channel.send(`I couldn't find the role: ${role_name} in this server.`);
                                                            sql.get(`SELECT * FROM guild_self_roles WHERE guildId ="${message.guild.id}"`).then(row => {
                                                                if (!row) {
                                                                    sql.run("INSERT INTO guild_self_roles (guildId, self_role_enabled, self_roles) VALUES (?, ?, ?)", [message.guild.id, `enabled`, `${role}`]);
                                                                }
                                                            }).catch((err) => {
                                                                console.log(err);
                                                                sql.run("CREATE TABLE IF NOT EXISTS guild_self_roles (guidId TEXT, self_role_enabled TEXT, self_roles TEXT)").then(() => {
                                                                    sql.run("INSERT INTO guild_self_roles (guildId, self_role_enabled, self_roles) VALUES (?, ?, ?)", [message.guild.id, `enabled`, `${role}`]);
                                                                });
                                                            });
                                                            sql.get(`SELECT * FROM guild_self_roles WHERE guildId ="${message.guild.id}"`).then(row => {
                                                                if (!row) return;
                                                                if (row.role.length >= 300) return message.channel.send("Have hit the max roles that you can set please remove one and try again.")
                                                                if (row.self_roles === 'none') {
                                                                    sql.run(`UPDATE guild_self_roles SET self_roles = "${role}" WHERE guildId = "${message.guild.id}"`);
                                                                    message.channel.send("***" + role + " has been successfully added! :white_check_mark:***");
                                                                } else {
                                                                    sql.run(`UPDATE guild_self_roles SET self_roles = "${row.self_roles},${role}" WHERE guildId = "${message.guild.id}"`);
                                                                    message.channel.send("***" + role + " has been successfully added! :white_check_mark:***");
                                                                }
                                                            })
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
                                        } else if (resp.content === '2') {
                                            message.channel.send('```Which role would you like to remove?\n\nType the role name or all to remove them all.\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
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
                                                                sql.run(`UPDATE guild_self_roles SET self_roles = "none" WHERE guildId = ${message.guild.id}`);
                                                                message.channel.send("***All roles have been successfully removed! :white_check_mark:***");
                                                            } else {
                                                                sql.get(`SELECT self_roles FROM guild_self_roles WHERE guildId ="${message.guild.id}"`).then(row => {
                                                                    if (!row) return message.channel.send('Need to add roles first.');
                                                                    sql.run(`UPDATE guild_self_roles SET self_roles = "${row.self_roles.split(resp.content.toLowerCase() + ',').pop()}" WHERE guildId = ${message.guild.id}`);
                                                                    message.channel.send("***" + role + " has been successfully removed! :white_check_mark:***");
                                                                })
                                                            }
                                                        })
                                                })
                                        } else if (resp.content === '3') {
                                            sql.get(`SELECT self_role_enabled FROM guild_self_roles WHERE guildId ="${message.guild.id}"`).then(row => {
                                                if (!row) return message.channel.send('Need to add roles first.');
                                                if (row.self_role_enabled) {
                                                    sql.run(`UPDATE guild_self_roles SET self_role_enabled = "disabled" WHERE guildId = "${message.guild.id}"`);
                                                } else {
                                                    sql.run(`UPDATE guild_self_roles SET self_role_enabled = "enabled" WHERE guildId = "${message.guild.id}"`);
                                                }
                                            })
                                        } else if (resp.content === '4') {
                                            sql.get(`SELECT self_roles FROM guild_self_roles WHERE guildId ="${message.guild.id}"`).then(row => {
                                                if (!row) return message.channel.send('Need to add roles first.');
                                                message.channel.send(`Self assignable roles are: ${row.self_roles}`);
                                            })
                                        } else {
                                            message.channel.send('Self-role has been cancelled.');
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
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'self-role',
    description: 'Allows users to give them selves roles that an admin set.',
    usage: 'self-role'
};