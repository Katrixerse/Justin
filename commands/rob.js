const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
const talkedRecently = new Set();
exports.run = (client, message, args) => {
    const user = message.mentions.users.first();
    if (message.mentions.users.size < 1) return message.channel.send("Need to tag a user to rob them.")
    if (user.id === message.author.id) return message.channel.send("You can't rob money from yourself")
    if (talkedRecently.has(message.author.id)) {
        message.channel.send("Wait 1 minute before trying to rob again.");
    } else {
        sql.get(`SELECT cash FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
            sql.get(`SELECT cash FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`).then(row2 => {
                if (!row) return message.channel.nend("Have no money need to start talking first.")
                if (!row2) return message.channel.nend("User has no money need to earn some before you can rob them.")
                if (row2.cash < 0) return message.channel.send("User has no money to rob them.")
                var chnace_to_rpb = Math.floor(Math.random() * 99 + 1);
                var amount_robbed = Math.floor(Math.random() * row2.cash);
                var amount_fined = Math.floor(Math.random() * 4800 + 201);
                if (chnace_to_rpb >= "75") {
                    if (row2.cash <= 0) return message.channel.send("You tried to rob " + user.username + ", but they had no money on them, New balance: $" + row.cash + ".")
                    sql.run(`UPDATE user_profiles SET cash = ${row.cash += amount_robbed} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    sql.run(`UPDATE user_profiles SET cash = ${row2.cash -= amount_robbed} WHERE guildId ="${message.guild.id}" AND userId = ${user.id}`);
                    message.channel.send("You have successfully robbed $" + amount_robbed + ", from " + user.username + ", New balance: $" + row.cash + ".")
                    talkedRecently.add(message.author.id);
                } else {
                    sql.run(`UPDATE user_profiles SET cash = ${row.cash -= amount_fined} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    message.channel.send("You were caught trying to rob " + user.username + ", and you payed a fine of: $" + amount_fined + ", New balance: $" + row.cash + ".")
                    talkedRecently.add(message.author.id);
                }
                setTimeout(() => {
                    talkedRecently.delete(message.author.id);
                }, 60000);
            })
        })
    }
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'economy'
};

exports.help = {
    name: 'rob',
    description: 'Tries to rob another user.',
    usage: 'rob @User'
};