const Discord = require('discord.js');
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
const talkedRecently = new Set();
exports.run = (client, message) => {
    if (talkedRecently.has(message.author.id)) return;
    var random_amount = Math.floor(Math.random() * 800 + 201);
    sql.get(`SELECT cash FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`).then(row => {
        sql.run(`UPDATE user_profiles SET cash = ${row.cash + random_amount} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
    })
    message.channel.send(`Daily of $${random_amount} has been claimed please wait 24 hours to claim again.`);
    talkedRecently.add(message.author.id);
    setTimeout(() => {
        talkedRecently.delete(message.author.id);
    }, 24 * 3600000);
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'economy'
};

exports.help = {
    name: 'daily',
    description: 'Gives you $200-1001 when used. [Can only be used once every 24 hours]',
    usage: 'daily '
};