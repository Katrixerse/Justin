const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD", false, true, true)) return message.channel.send("You are missing MANAGE_GUILD permission");
    sql.get(`SELECT gp.role_persist_enabled, gz.casenumber FROM guild_misc_settings as gp left join guild_moderation_settings as gz on gp.guildId = gz.guildI WHERE gp.guildId ="${message.guild.id}"`).then(row => {
        const helpembed = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .addField('Which Option would you like to use?', '\n[1] - Enable role-persist\n[2] - Disable role-persist\n# Warning roles above the bot or no longer exist wont be added back.\n# Type the number to see the page.\n# Type exit to leave this menu.')
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
                            if (row.rolepersist === "enabled") return message.channel.send("Role-persist is already enabled")
                            sql.run(`UPDATE guild_misc_settings SET role_persist_enabled = "enabled" WHERE guildId = ${message.guild.id}`);
                            message.channel.send("Now users will automatically get roles that they left with if they rejoin.")
                            let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
                            const embed = new Discord.RichEmbed()
                                .setColor(0x00A2E8)
                                .setTitle("Case #" + row.casenumber + " | Action: Role Persist Enabled")
                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                .setFooter("Time used: " + message.createdAt.toDateString())
                            if (!modlog) return;
                            if (row.logsenabled === "disabled") return;
                            return client.channels.get(modlog.id).send({
                                embed
                            });
                        } else if (resp.content === "2") {
                            sql.run(`UPDATE guild_misc_settings SET role_persist_enabled = "disabled" WHERE guildId = ${message.guild.id}`);
                            message.channel.send("Now users wont get left roles automatically back when they join.")
                            let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
                            const embed = new Discord.RichEmbed()
                                .setColor(0x00A2E8)
                                .setTitle("Case #" + row.casenumber + " | Action: Role Persist Disabled")
                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                .setFooter("Time used: " + message.createdAt.toDateString())
                            if (!modlog) return;
                            if (row.logsenabled === "disabled") return;
                            return client.channels.get(modlog.id).send({
                                embed
                            });
                        } else if (resp.content === "exit") {
                            message.channel.send("Cancelled role-persist command.");
                        } else {
                            message.channel.send("Cancelled role-persist command.");
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
    guildOnly: true,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'role-persist',
    description: 'Allows users to leave the server and auto get their roles back.',
    usage: 'role-persist'
};