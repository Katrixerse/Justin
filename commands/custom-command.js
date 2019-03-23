const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
var cc_placeholders = [
    "What would you want the command to respond with?.",
    "\n",
    "Main Place-Holders.",
    "```%author.name% - User that's using the command.",
    "%author.mention% - Mentions the message author.",
    "%response.delete% - Deletes command 5 seconds after use.```",
    /*"User Place-Holders:",
    "```%user.id% - User's id",
    "%user.name% - User's nickname including the discrim",
    "%user.username% - User's username",
    "%user.discriminator% aka %user.discrim% - User's discriminator",
    "%user.nick% - User's nickname excluding the discrim",
    "%user.game% - User's current game (if nothing, gets the last played game)",
    "%user.avatar% - User's avatar",
    "%user.mention% - Mentions the user",
    "%user.createdAt% - User's registeration date",
    "%user.joinedAt% - User's join date```"*/
    "Server Place-Holders",
    "```%server.id% - Server's ID.",
    "%server.name% - Server's name.",
    "%server.memberCount% - Amount of members on the server.",
    "%server.ownerID% - Owner's ID.",
    "%server.createdAt% - Server's creation date.",
    "%server.region% - Server region.```",
    "Channel Place-Holders",
    "```%channel.id% - Channel ID.",
    "%channel.name% - Channel name.",
    "%channel.mention% - Channel mention.```",
    /*"%time%/%date% Variables",
    "```%time% - Current 24 hour time (EST timezone)",
    "%time12% - Current 12 hour time",
    "%date% - Current date",
    "%datetime% - Current date with the 24 hour time",
    "%datetime12% - Current date with the 12 hour time```",*/
    "Advanced Place-Holders - (Note: Most of these must be on separate lines)",
    "```%prefix% - Output command prefix for server.",
    "%require-r:rolename% - Set required roles to use command, example: %require-r:Mod% or %require-r:VIP%```",
    /*"%require:#channel% - Set required channel to use command in, example:%require:#batcave% This is the batcave.",
    "%not:role% - Blacklist Role from using command, example:%not:Lost Privileges%",
    "%not:#channel% - Blacklist from being able to use command in said channel, example:%not:#general%",
    "%respond:#channel% - Set the channel the command responds in, example: %respond:#announcements% Announcements woo!",
    "%dm% - DM the bot response, example: %dm% I just DMed you!",
    "%dm:user% - DMs the bot response to a specified user, example: %dm:Nooblance% I just DMed the mighty Lance!```"*/
]
exports.run = (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_GUILD', false, true, true)) return message.reply('Sorry, you\'re missing the required permission to do this command you need MANAGE_GUILD. :x:');
    const helpembed = new Discord.RichEmbed()
        .setColor(0x6B363E)
        .addField('Which custom command option would you like to use?', '\n[1/add] - Add command\n[2/remove] - Remove Command\n[3/enable] - Enable custom commands\n[4/disable] - Disable custom commands\n[5/view] - View custom commands for this guild.\n# Type the number to see the page.\n# Type exit to leave this menu.')
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
                    const resp_lower = resp.content.toLowerCase();
                    if (resp_lower === "1" || resp_lower === "add") {
                        message.channel.send("What would you want the command name to be?")
                            .then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 30000,
                                        errors: ['time'],
                                    })
                                    .then((resp) => {
                                        if (!resp) return;
                                        resp = resp.array()[0];
                                        let commandname;
                                        sql.get(`SELECT prefix FROM guild_prefix WHERE guildId ="${message.guild.id}"`).then(row1 => {
                                            const command_name_remove_prefix = resp.content.replace(`${row1.prefix}`, ``);
                                            commandname = command_name_remove_prefix;
                                        })
                                        const cc_placeholders_embed = new Discord.RichEmbed()
                                            .setColor(0x6B363E)
                                            .setTitle("Custom commands. (Beta)")
                                            .setDescription(cc_placeholders)
                                        message.channel.send(cc_placeholders_embed)
                                            .then(() => {
                                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                        max: 1,
                                                        time: 30000,
                                                        errors: ['time'],
                                                    })
                                                    .then(async (resp) => {
                                                        if (!resp) return;
                                                        resp = resp.array()[0];
                                                        sql.get(`SELECT COUNT(command_name) as cc_count FROM guild_custom_commands WHERE guildId = '${message.guild.id}'`).then(row => {
                                                            if (row.cc_count >= 25) {
                                                                return message.channel.send('You can\'t create more than 25 custom commands please delete one and try again.');
                                                            } else {
                                                                sql.get(`SELECT * FROM guild_custom_commands WHERE guildId = '${message.guild.id}' AND command_name = '${commandname}'`).then(row => {
                                                                    if (!row && client.commands.has(commandname) === false && client.aliases.has(commandname) === false) {
                                                                        if (commandname.length <= 0 || resp.content.length <= 0) return;
                                                                        sql.run(`INSERT INTO guild_custom_commands (guildId, command_name, command_output) VALUES (?, ?, ?)`, [message.guild.id, `${commandname}`, `${resp.content}`]);
                                                                        return message.channel.send("Custom command has been added!");
                                                                    } else {
                                                                        return message.channel.send('Command name already exists as a default or custom command already, please pick a different command name and try again.');
                                                                    };
                                                                });
                                                            }
                                                        })
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
                                    }).catch((err) => {
                                        if (err.message === undefined) {
                                            message.channel.send('You provided no input in the time limit, please try again.')
                                        } else {
                                            console.log(err)
                                            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                        }
                                    });
                            })
                    } else if (resp_lower === "2" || resp_lower === "remove") {
                        message.channel.send("What custom command would you like to remove? (type the command name please or all.)")
                            .then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 30000,
                                        errors: ['time'],
                                    })
                                    .then((resp) => {
                                        if (!resp) return;
                                        resp = resp.array()[0];
                                        if (resp.content === "all") {
                                            sql.run(`DELETE FROM guild_custom_commands WHERE guildId = "${message.guild.id}"`);
                                            message.channel.send("All custom command have been removed!");
                                        } else {
                                            sql.get(`SELECT * FROM guild_custom_commands WHERE guildId = '${message.guild.id}' AND command_name = '${resp.content}'`).then(row => {
                                                if (!row) {
                                                    message.channel.send(`Failed to delete the command: ${resp.content}, doesn't seem to exist.`)
                                                } else {
                                                    sql.run(`DELETE FROM guild_custom_commands WHERE guildId = "${message.guild.id}" AND command_name = "${resp.content}" `);
                                                    message.channel.send("Custom command has been removed!");
                                                }   
                                            })
                                        }
                                    }).catch(() => {});
                            })
                    } else if (resp_lower === "3" || resp_lower === "enable") {
                        sql.run(`UPDATE guild_misc_settings SET custom_commands_enabled = 'enabled' WHERE guildId = ${message.guild.id}`);
                        message.channel.send('Custom commands have been enabled.');
                    } else if (resp_lower === "4" || resp_lower === "disable") {
                        sql.run(`UPDATE guild_misc_settings SET custom_commands_enabled = 'disabled' WHERE guildId = ${message.guild.id}`);
                        message.channel.send('Custom commands have been disabled.');
                    } else if (resp_lower === "5" || resp_lower === "view") {
                        sql.all(`SELECT command_name FROM guild_custom_commands WHERE guildId ="${message.guild.id}" ORDER BY command_name DESC LIMIT 15`).then(rows => {
                            if (!rows) return message.channel.send("Guild has no custom commands at this moment, please try again later.");
                            var y = 0;
                            var leaders = '';
                            rows.forEach(function (row) {
                                if (leaders.includes(`${row.username}`)) return;

                                function increment() {
                                    y += 1;
                                    return y;
                                }
                                leaders += `${increment()}: ${row.command_name}\n`
                            })
                            message.channel.send({
                                embed: {
                                    title: `${message.guild.name} custom commands, total: ${y}`,
                                    color: 3447003,
                                    description: `${leaders}`
                                }
                            })
                            y = 0;
                        })
                    } else if (resp.content === "exit") {

                    } else {
                        message.channel.send('That wasn\'t a valid option please try again.');
                    }
                })
        })
        .catch((err) => {
            if (err.message === undefined) {
                message.channel.send('You provided no input in the time limit, please try again.')
            } else {
                console.log(err)
                return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
            }
        });
}

exports.conf = {
    guildOnly: true,
    aliases: ['cc', 'c-c'],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'custom-command',
    description: 'Create a new custom command or delete an existing one.',
    usage: 'custom-command'
};