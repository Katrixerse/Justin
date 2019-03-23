const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    let transferamount = args[0]
        if (transferamount <= 1) return message.channel.send("You can't withdraw anything below 1");
            sql.get(`SELECT cash, bank FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
                if (transferamount === "all") {
                    if (!row) return message.channel.nend("Have no money in the bank to withdraw need to start talking first.")
                    if (row.bank <= 0) return message.channel.send("You dont have enough money to withdraw that much, you have: $" + row.bank);
                    let curcash = row.cash
                    let curbank = row.bank
                    sql.run(`UPDATE user_profiles SET cash = ${row.cash += curbank} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    sql.run(`UPDATE user_profiles SET bank = ${row.bank -= curbank} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    message.channel.send("I have successfully withdrawal $" + curbank + ", from your bank.")
                } else {
                    if (isNaN(transferamount)) return message.channel.send("Not a valid number to withdraw");
                    let transferamount2 = parseInt(transferamount);
                    if (!row) return message.channel.nend("Have no money in the bank to withdraw need to start talking first.")
                    if (row.bank < transferamount2) return message.channel.send("You dont have enough money to withdraw that much, you have: $" + row.bank);
                    sql.run(`UPDATE user_profiles SET cash = ${row.cash += transferamount2} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    sql.run(`UPDATE user_profiles SET bank = ${row.bank -= transferamount2} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    message.channel.send("I have successfully withdrawal $" + transferamount2 + ", from your bank.")
                }
            })
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'economy'
};

exports.help = {
    name: 'withdraw',
    description: 'Rolls the dice if you get above 25 you win 1.25x your bet.',
    usage: 'withdraw <amount>'
};