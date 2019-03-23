const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    let transferamount = args[0]
        if (transferamount <= 1) return message.channel.send("You can't deposit anything below 1");
            sql.get(`SELECT cash, bank FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
                if (transferamount === "all") {
                    if (!row) return message.channel.nend("Have no cash to deposit need to start talking first.")
                    if (row.cash <= 0) return message.channel.send("You dont have enough money to deposit that much, you have: $" + row.cash);
                    let curcash = row.cash
                    let curbank = row.bank
                    sql.run(`UPDATE user_profiles SET bank = ${row.bank += curcash} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    sql.run(`UPDATE user_profiles SET cash = ${row.cash -= curcash} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    message.channel.send("I have successfully deposited $" + curcash + ", to your bank.")
                } else {
                    if (isNaN(transferamount)) return message.channel.send("Not a valid number to deposit");
                    let transferamount2 = parseInt(transferamount);
                    if (!row) return message.channel.nend("Have no cash to deposit need to start talking first.")
                    if (row.cash < transferamount) return message.channel.send("You dont have enough money to deposit that much, you have: $" + row.cash);
                    sql.run(`UPDATE user_profiles SET cash = ${row.cash -= transferamount2} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    sql.run(`UPDATE user_profiles SET bank = ${row.bank += transferamount2} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    message.channel.send("I have successfully deposited $" + transferamount + ", to your bank.")
                }
            })
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'economy'
};

exports.help = {
    name: 'deposit',
    description: 'Lets you deposit money in the Bank of Justin.',
    usage: 'deposit <amount>'
};
