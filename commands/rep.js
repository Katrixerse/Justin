const Discord = require('discord.js')
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
const talkedRecently = new Set();
exports.run = (client, message, args) => {
    let user = message.mentions.users.first();
    if (user.id === message.author.id) return message.channel.send('Can\'t give rep to yourself.')
    if (talkedRecently.has(message.author.id)) return message.channel.send('Please wait another 24 hours before trying to rep this user again.');
    sql.get(`SELECT rep FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`).then(row => {
        sql.run(`UPDATE user_profiles SET rep = ${row.rep += 1} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
    })
    talkedRecently.add(message.author.id);
    setTimeout(() => {
        talkedRecently.delete(message.author.id);
    }, 24 * 3600000);
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'profile'
};

exports.help = {
    name: 'rep',
    description: 'Changes the guilds prefix.',
    usage: 'rep @User'
};