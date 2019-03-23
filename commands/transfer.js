const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    const user = message.mentions.users.first();
    if (message.mentions.users.size < 1) return message.channel.send("Need to tag a user to transfer money to them.")
    let transferamount = args.slice(1).join(' ');
    if (transferamount === "all") {
        if (user.id === message.author.id) return message.channel.send("Can't transfer money to yourself")
        sql.get(`SELECT cash FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
            if (!row) return message.channel.nend("You have no money need to start talking first.")
            let moneytemp = row.cash
            if (row.cash <= 1) return message.channel.send("You dont have enough money to transfer that much, you have: $" + row.cash);
            sql.run(`UPDATE user_profiles SET cash = ${row.cash = 0} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
            sql.get(`SELECT cash FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`).then(row2 => {
                if (!row2) return message.channel.nend("Have no money need to start talking first.")
                sql.run(`UPDATE user_profiles SET cash = ${row2.cash += moneytemp} WHERE guildId ="${message.guild.id}" AND userId = ${user.id}`);
            })
            message.channel.send("I have successfully transfered $" + moneytemp + ", to " + user.username + ", New balance: $" + row.cash + ".")
        })
    } else {
        let transferamountfix = parseInt(transferamount)
        if (transferamountfix <= 1) return message.channel.send("You can't give anything below 1");
        if (isNaN(transferamountfix)) return message.channel.send("Not a valid number");
        if (user.id === message.author.id) return message.channel.send("Can't transfer money to yourself")
        sql.get(`SELECT cash FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
            if (!row) return message.channel.nend("Have no money need to start talking first.")
            if (row.cash < transferamountfix) return message.channel.send("You dont have enough money to transfer that much, you have: $" + row.cash);
            sql.run(`UPDATE user_profiles SET cash = ${row.cash -= transferamountfix} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
            message.channel.send("I have successfully transfered $" + transferamountfix + ", to " + user.username + ", New balance: $" + row.cash + ".")
            sql.get(`SELECT cash FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`).then(row2 => {
                if (!row2) return message.channel.nend(`${user.username} hasn't talked so we can't set up their bank.`)
                sql.run(`UPDATE user_profiles SET cash = ${row2.cash += transferamountfix} WHERE guildId ="${message.guild.id}" AND userId = ${user.id}`);
            })
        })
    }
}

exports.conf = {
    guildOnly: false,
    aliases: ['pay'],
    commandCategory: 'economy'
};

exports.help = {
    name: 'transfer',
    description: 'Allows you to transfer your money to another user.',
    usage: 'tramsfer @User [amount]'
};