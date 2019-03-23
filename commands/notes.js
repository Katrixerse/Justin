const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    message.channel.send('```Which Option would you like to use?\n[1] - Add a new note\n[2] - Clear notes\n[3] - View notes\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
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
                        message.channel.send('```Type in the note you would like to add!\n\n# Type exit to leave this menu.```')
                            .then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 30000,
                                        errors: ['time'],
                                    })
                                    .then((resp) => {
                                        if (!resp) return;
                                        resp = resp.array()[0];
                                        if (resp.content === 'exit') {
                                            return message.channel.send('Notes command has been cancelled.');
                                        } else {
                                            if (resp.content.length >= 120) return message.channel.send('Per note has a limit of 120 characters, please try again.')
                                            sql.get(`SELECT * FROM user_notes WHERE userId ="${message.author.id}"`).then(row2 => {
                                                if (!row2) {
                                                    sql.run("INSERT INTO user_notes (userId, usernote) VALUES (?, ?)", [message.author.id, `${resp.cotent}.`]);
                                                } else {
                                                    if (row2.usernote >= 700) return message.channel.send("Notes cant go over 700 characters in total please use >notes 3.");
                                                }
                                            }).catch(() => {
                                                console.error;
                                                sql.run("CREATE TABLE IF NOT EXISTS user_notes (userId TEXT, usernote TEXT)").then(() => {
                                                    sql.run("INSERT INTO user_notes (userId, usernote) VALUES (?, ?)", [message.author.id, `${resp.content}.`]);
                                                });
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
                    } else if (resp.content === '2') {
                        sql.get(`SELECT * FROM user_notes WHERE userId ="${message.author.id}"`).then(row3 => {
                            if (!row3) return message.channel.send("Notes have been removed.")
                            sql.run(`DELETE FROM user_notes WHERE userId ="${message.author.id}"`)
                            message.channel.send("Notes have been removed.")
                        })
                    } else if (resp.content === '3') {
                        sql.get(`SELECT * FROM user_notes WHERE userId ="${message.author.id}"`).then(row4 => {
                            if (!row4) return message.channel.send("Notes have been removed.")
                            message.channel.send("User notes: \n ```" + row4.usernote + "```")
                        })
                    } else if (resp.content === 'exit') {
                        message.channel.send('Notes command has been cancelled.');
                    } else {
                        message.channel.send('You provided no valid input in the time limit, please try again.');
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

    if (numbertopick === 1) {
        if (newnote < 1) return message.channel.send(usage)
        sql.get(`SELECT * FROM usernotes WHERE userId ="${message.author.id}"`).then(row2 => {
            if (row2.usernote >= 600) return message.channel.send("Notes cant go over 600 characters in total please use >notes 3.")
            if (!row2) return sql.run("INSERT INTO usernotes (userId, usernote) VALUES (?, ?)", [message.author.id, `${newnote}.`]);
        }).catch(() => {
            console.error;
            sql.run("CREATE TABLE IF NOT EXISTS usernotes (userId TEXT, usernote TEXT)").then(() => {
                sql.run("INSERT INTO usernotes (userId, usernote) VALUES (?, ?)", [message.author.id, `${newnote}.`]);
            });
        });
        message.channel.send("Note has been added to view current notes use >notes 3.")
        sql.get(`SELECT * FROM usernotes WHERE userId ="${message.author.id}"`).then(row2 => {
            sql.run(`UPDATE usernotes SET usernote = "${row2.usernote}\n${newnote}." WHERE userId = ${message.author.id}`);
        })
    } else if (numbertopick === 2) {
        sql.get(`SELECT * FROM usernotes WHERE userId ="${message.author.id}"`).then(row3 => {
            if (!row3) return message.channel.send("Notes have been removed.")
            sql.run(`DELETE FROM usernotes WHERE userId ="${message.author.id}"`)
            message.channel.send("Notes have been removed.")
        })
    } else if (numbertopick === 3) {
        sql.get(`SELECT * FROM usernotes WHERE userId ="${message.author.id}"`).then(row4 => {
            if (!row4) return message.channel.send("Notes have been removed.")
            message.channel.send("User notes: \n ```" + row4.usernote + "```")
        })
    } else {
        message.channel.send(usage)
    }
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'notes',
    description: 'Allows you to store notes with the bot.',
    usage: 'notes [your note]'
};