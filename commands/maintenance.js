const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    sql.get(`SELECT * FROM bot_settings`).then(row => {
        if (message.author.id === "130515926117253122") {
            message.channel.send('Would you like to set a maintence message')
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
                                return message.channel.send('What would you like it to be?')
                                    .then(() => {
                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                max: 1,
                                                time: 30000,
                                                errors: ['time'],
                                            })
                                            .then((resp) => {
                                                if (!resp) return;
                                                resp = resp.array()[0];
                                                sql.run(`UPDATE bot_settings SET maintenance_mode = "enabled", maintenance_reason = "${resp.content}"`);
                                                return message.channel.send('Maintenance mode/message has been updated');
                                            })
                                    })
                            } else if (resp.content === "no") {
                                sql.run(`UPDATE bot_settings SET maintenance_mode = "none", maintenance_reason = "NA"`);
                                return message.channel.send('Maintenance mode/message has been updated');
                            } else if (resp.content === "exit") {
                                return message.channel.send('Maintenance command cancelled');
                            } else {
                                return message.channel.send('Maintenance command cancelled');
                            }
                        });
                });
        } else {
            if (row.maintenance_mode === "none") {
                return message.channel.send("There is no maintenance message at this time.");
            } else {
                return message.channel.send(`Bots currently in maintenance mode, Reason: ${row.maintenance_reason}`);
            }
        }
    });
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'maintenance',
    description: 'If the bots under maintenance this command can give you more details on why.',
    usage: 'maintenance'
};