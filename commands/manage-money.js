const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    message.channel.send('```Which Option would you like to use?\n\n[1] - Add money.\n[2] - Take money.\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
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
                        message.channel.send('```Which users money would you like to modify?\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
                            .then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 30000,
                                        errors: ['time'],
                                    })
                                    .then((resp) => {
                                        if (!resp) return;
                                        resp = resp.array()[0];
                                        let user_2 = resp.content;
                                        let user_fix = user_2.replace('<@', '').replace('>', "")
                                        let user = message.guild.member(`${user_fix}`)
                                        if (!user) return message.channel.send('Need to tag a user in this guild.');
                                        message.channel.send('```How much money would you like to give this user?\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
                                            .then(() => {
                                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                        max: 1,
                                                        time: 30000,
                                                        errors: ['time'],
                                                    })
                                                    .then((resp) => {
                                                        if (!resp) return;
                                                        resp = resp.array()[0];
                                                        if (isNaN(resp.content)) return message.channel.send("Not a valid number.");
                                                        const fixed_amount = parseInt(resp.content);
                                                        sql.get(`SELECT cash, bank FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${user}"`).then(row => {
                                                            if (!row) message.channel.send("User needs to start talking first.");
                                                            const doingmath = row.cash + row.bank;
                                                            if (doingmath >= 9999999999) return message.channel.send("Max money is $9,999,999,999");
                                                            if (fixed_amount >= 9999999999) return message.channel.send("Max money to give is $9,999,999,999");
                                                            sql.run(`UPDATE user_profiles SET cash = ${row.cash += fixed_amount} WHERE guildId ="${message.guild.id}" AND userId = ${user}`);
                                                            message.channel.send("I have given money to: " + user.username + " $" + fixed_amount);
                                                        })
                                                    })
                                            })
                                    })
                            })
                    } else if (resp.content === '2') {
                        message.channel.send('```Which users money would you like to modify?\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
                            .then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 30000,
                                        errors: ['time'],
                                    })
                                    .then((resp) => {
                                        if (!resp) return;
                                        resp = resp.array()[0];
                                        let user_2 = resp.content;
                                        let user_fix = user_2.replace('<@', '').replace('>', "")
                                        let user = message.guild.member(`${user_fix}`)
                                        if (!user) return message.channel.send('Need to tag a user in this guild.');
                                        message.channel.send('```How much money would you like to give this user?\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
                                            .then(() => {
                                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                        max: 1,
                                                        time: 30000,
                                                        errors: ['time'],
                                                    })
                                                    .then((resp) => {
                                                        if (!resp) return;
                                                        resp = resp.array()[0];
                                                        if (isNaN(resp.content)) return message.channel.send("Not a valid number.");
                                                        const fixed_amount = parseInt(resp.content);
                                                        sql.get(`SELECT cash, bank FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${user}"`).then(row => {
                                                            if (!row) message.channel.send("User needs to start talking first.");
                                                            const doingmath = row.cash + row.bank;
                                                            if (doingmath >= 9999999999) return message.channel.send("Max money is $9,999,999,999");
                                                            if (fixed_amount >= 9999999999) return message.channel.send("Max money to take is $9,999,999,999");
                                                            sql.run(`UPDATE user_profiles SET cash = ${row.cash -= fixed_amount} WHERE guildId ="${message.guild.id}" AND userId = ${user}`);
                                                            message.channel.send("I have taken money from: " + user.username + " $" + fixed_amount);
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
                            }).catch((err) => {
                                if (err.message === undefined) {
                                    message.channel.send('You provided no input in the time limit, please try again.')
                                } else {
                                    console.log(err)
                                    return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                }
                            });
                    } else if (resp.content === 'exit') {
                        message.channel.send('Manage-money command has been cancelled.');
                    } else {
                        message.channel.send('Manage-money command has been cancelled.');
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

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'economy'
};

exports.help = {
    name: 'manage-money',
    description: 'Allows you to modify a users money.',
    usage: 'manage-money'
};