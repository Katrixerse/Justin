const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD", false, true, true)) return message.reply('Sorry, you\'re missing the required permission to use this command, need MANAGE_GUILD. :x:');
    sql.get(`SELECT gz.mod_logs_enabled, gz.mod_logs_channel, gy.wl_enabled FROM guild_moderation_settings as gz left join guild_wl_system as gy on gz.guildId = gy.guildId WHERE gz.guildId = '${message.guild.id}'`).then(row => {

        message.channel.send('```Which Option would you like to use?\n\n[1] - Enable welcome/leave messages\n[2] - Disable welcome/leave messages\n[3] - Set welcome/level channel\n[4] - Set welcome message\n[5] - Set leave message\n[6] - Enable dm welcome/leave messages\n[7] - Disable dm welcome/leave messages\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
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
                            if (row.wl_enabled === "enabled") return message.channel.send("Welome/leave messages have already been enabled");
                            sql.run(`UPDATE guild_wl_system SET wl_enabled = "enabled" WHERE guildId = ${message.guild.id}`);
                            message.channel.send("I have enabled welcome/leave messages for this guild.");
                        } else if (resp.content === "2") {
                            if (row.wl_enabled === "disabled") return message.channel.send("Welome/leave messages have already been disabled");
                            sql.run(`UPDATE guild_wl_system SET wl_enabled = "disabled" WHERE guildId = ${message.guild.id}`);
                            message.channel.send("I have disabled welcome/leave messages for this guild.");
                        } else if (resp.content === "3") {
                            message.channel.send('```Which Option would you like to use?\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
                                .then(() => {
                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time'],
                                        })
                                        .then((resp) => {
                                            if (!resp) return;
                                            resp = resp.array()[0];
                                            if (resp.content < 1) return message.channel.send(embed10)
                                            const newwlchannelfix = resp.content.replace(/[^\x00-\x7F]/g, "");
                                            if (resp.content.length < 1) return message.channel.send("Didn't provide a new channel to set")
                                            if (newwlchannelfix.length < 1) return message.channel.send("channel can't have non-ascii characters")
                                            if (resp.content.length > 25) return message.channel.send("channel can't be longer then 25 characters")
                                            sql.run(`UPDATE guild_wl_system SET wl_channel = "${newwlchannelfix}" WHERE guildId = ${message.guild.id}`);
                                            message.channel.send("I have set the new guild welcome channel to " + newwlchannelfix)
                                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                                            const embed = new Discord.RichEmbed()
                                                .setColor(0x6B363E)
                                                .setTitle("Case #" + row.casenumber + " | Action: Welcome Channel Changed")
                                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                .addField("New Channel", newwlchannelfix, true)
                                                .setFooter("Time used: " + message.createdAt.toDateString())
                                            if (!modlog) return;
                                            if (row.mod_logs_enabled === "disabled") return;
                                            client.channels.get(modlog.id).send(embed);
                                        })
                                })
                        } else if (resp.content === "4") {
                            message.channel.send('```What would you like the new welcome message be?\n\nPlace-Holders:\n%user.mention% - Will mention the user.\n%server.name% - Will say the guild name.\n%user.name% - Will say the users name.\n%server.memberCount% - Will say the current membercount\n# Type the new welcome message.\n# Type exit to leave this menu.```')
                                .then(() => {
                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time'],
                                        })
                                        .then((resp) => {
                                            if (!resp) return;
                                            resp = resp.array()[0];
                                            if (resp.content < 1) return message.channel.send(embed10)
                                            const newwelcomemessagefix = resp.content.replace(/[^\x00-\x7F]/g, "");
                                            if (resp.content.length < 1) return message.channel.send("Didn't provide a new message to set")
                                            if (newwelcomemessagefix.length < 1) return message.channel.send("Leave message can't have non-ascii characters")
                                            if (resp.content.length > 400) return message.channel.send("Welcome message can't be longer then 400 characters")
                                            sql.run(`UPDATE guild_wl_system SET welcome_message = "${newwelcomemessagefix}" WHERE guildId = ${message.guild.id}`);
                                            message.channel.send("I have set the new guild welcome message to " + newwelcomemessagefix)
                                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                                            const embed = new Discord.RichEmbed()
                                                .setColor(0x6B363E)
                                                .setTitle("Case #" + row.casenumber + " | Action: Welcome Message Changed")
                                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                .addField("New Message", newwelcomemessagefix, true)
                                                .setFooter("Time used: " + message.createdAt.toDateString())
                                            if (!modlog) return;
                                            if (row.mod_logs_enabled === "disabled") return;
                                            client.channels.get(modlog.id).send(embed);
                                        })
                                })
                        } else if (resp.content === "5") {
                            message.channel.send('```What would you like the new leave message be?\n\nPlace-Holders:\n%server.name% - Will say the guild name.\n%user.name% - Will say the users name.\n%server.memberCount% - Will say the current membercount\n# Type the new leave message.\n# Type exit to leave this menu.```')
                                .then(() => {
                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time'],
                                        })
                                        .then((resp) => {
                                            if (!resp) return;
                                            resp = resp.array()[0];
                                            if (resp.content < 1) return message.channel.send(embed10)
                                            const newleavemessagefix = resp.content.replace(/[^\x00-\x7F]/g, "");
                                            if (resp.content.length < 1) return message.channel.send("Didn't provide a new message to set")
                                            if (newleavemessagefix.length < 1) return message.channel.send("Leave message can't have non-ascii characters")
                                            if (resp.content.length > 400) return message.channel.send("Leave message can't be longer then 400 characters.")
                                            sql.run(`UPDATE guild_wl_system SET leave_message = "${newleavemessagefix}" WHERE guildId = ${message.guild.id}`);
                                            message.channel.send("I have set the new guild leave message to " + newleavemessagefix)
                                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                                            const embed = new Discord.RichEmbed()
                                                .setColor(0x6B363E)
                                                .setTitle("Case #" + row.casenumber + " | Action: Leave Message Changed")
                                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                                .addField("New Message", newleavemessagefix, true)
                                                .setFooter("Time used: " + message.createdAt.toDateString())
                                            if (!modlog) return;
                                            if (row.mod_logs_enabled === "disabled") return;
                                            client.channels.get(modlog.id).send(embed);
                                        })
                                })
                        } else if (resp.content === "6") {
                            sql.run(`UPDATE guild_wl_system SET wl_dm_enabled = "enabled" WHERE guildId = ${message.guild.id}`);
                            message.channel.send("I have made it welcome/leave messages will go to dms.")
                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                            const embed = new Discord.RichEmbed()
                                .setColor(0x6B363E)
                                .setTitle("Case #" + row.casenumber + " | Action: Enabled welcome/leave in dms")
                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                .setFooter("Time used: " + message.createdAt.toDateString())
                            if (!modlog) return;
                            if (row.mod_logs_enabled === "disabled") return;
                            client.channels.get(modlog.id).send(embed);
                        } else if (resp.content === "7") {
                            sql.run(`UPDATE guild_wl_system SET wl_dm_enabled = "disabled" WHERE guildId = ${message.guild.id}`);
                            message.channel.send("I have made it welcome/leave messages will go to the channel.")
                            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
                            const embed = new Discord.RichEmbed()
                                .setColor(0x6B363E)
                                .setTitle("Case #" + row.casenumber + " | Action: Enabled welcome/leave in dms")
                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                .setFooter("Time used: " + message.createdAt.toDateString())
                            if (!modlog) return;
                            if (row.mod_logs_enabled === "disabled") return;
                            client.channels.get(modlog.id).send(embed);
                        } else if (resp.content === "exit") {
                            message.channel.send("Cancelled welcomeleave command.")
                        } else {
                            message.channel.send("There was no collected message that passed the filter within the time limit!")
                        }
                    })
                    .catch((err) => {
                        if (err.message === undefined) {
                            message.channel.send('You provided no input in the time limit, please try again.')
                        } else {
                            console.log(err)
                            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                        }
                    });
            })
    })
}

exports.conf = {
    guildOnly: false,
    aliases: ['wl', 'w-l'],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'welcome-leave',
    description: 'Allows you to manage the welcome/leave message system.',
    usage: 'welcome-leave'
};