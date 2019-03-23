const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
        const choice = args[1]
        let transferamount = parseInt(args[0]);
        if (transferamount <= 1) return message.channel.send("You can't bet anything below 1.");
        if (isNaN(transferamount)) return message.channel.send("Not a valid number.");
            sql.get(`SELECT cash FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
                if (!row) return message.channel.send("Need to start talking first.")
                if (row.cash < transferamount) return message.channel.send("You dont have enough money to bet that much, you have: $" + row.cash);
                var dice = Math.floor(Math.random() * 36);
                const wonamount = (Math.round(transferamount * 1.50))
                if (choice === "odd") {
                    if (dice & 1)
                    {
                        // ODD
                        message.channel.send("The ball landed on " + dice + " and you won $" + wonamount)
                        sql.run(`UPDATE user_profiles SET cash = ${row.cash += wonamount} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    }
                        else
                    {
                        // EVEN
                        message.channel.send("The ball landed on " + dice + " and you lost $" + transferamount)
                        sql.run(`UPDATE user_profiles SET cash = ${row.cash -= transferamount} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    }
                } else if (choice === "even") {
                    if (dice & 1)
                    {
                        // ODD
                        message.channel.send("The ball landed on " + dice + " and you lost $" + transferamount)
                        sql.run(`UPDATE user_profiles SET cash = ${row.cash -= transferamount} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    }
                        else
                    {
                        // EVEN
                        message.channel.send("The ball landed on " + dice + " and you won $" + wonamount)
                        sql.run(`UPDATE user_profiles SET cash = ${row.cash += wonamount} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    }
                } else {
                    message.channel.send("Not a valid choice either even or odd")
                }
            
          })
}

exports.conf = {
    guildOnly: false,
    aliases: ['rr'],
    commandCategory: 'economy'
};

exports.help = {
    name: 'roulette',
    description: 'Tries to rob another user.',
    usage: 'roulette @User'
};