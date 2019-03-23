const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = async (client, message, args) => {
    if (message.mentions.users.size < 1) {
        sql.get(`SELECT cash, bank FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(async row => {
            if (!row) return message.channel.send('Current balance is: $0 Need to start talking to earn some money.');
            const curcash = row.cash;
            const curbank = row.bank;
            const fixedcash = curcash.toLocaleString('en');
            const fixedbank = curbank.toLocaleString('en');
            const networth = curcash + curbank;
            const fixednetworth = networth.toLocaleString('en');
            if (!row) {
                message.channel.send("Need to start talking first!");
            }
            const embed = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTitle(" Money info For: " + message.author.username)
                .setThumbnail(message.author.avatarURL)
                .addField("Bank: ", "$" + fixedbank)
                .addField("Cash: ", "$" + fixedcash)
                .addField("Net Worth: ", "$" + fixednetworth);
            message.channel.send(embed);
        })
    } else if (message.content.includes("<@" + client.user.id + ">") || message.content.includes("<@!" + client.user.id + ">")) {
        const embed = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setTitle(" Money info For: " + client.user.username)
            .setThumbnail(client.user.avatarURL)
            .addField("Bank: ", "$" + "675,679,324,432")
            .addField("Cash: ", "$" + "1,657,562,386")
            .addField("Net Worth: ", "$" + "667,336,886,818");
        message.channel.send(embed);
    } else {
        let user = message.mentions.users.first();
        sql.get(`SELECT cash, bank FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`).then(row => {
            const curcash = row.cash;
            const curbank = row.bank;
            const fixedcash = curcash.toLocaleString('en');
            const fixedbank = curbank.toLocaleString('en');
            const networth = row.cash + row.bank;
            const fixednetworth = networth.toLocaleString('en');
            if (!row) return message.channel.send("User needs to start talking first.");
            const embed = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTitle(" Money info For: " + user.username + " ")
                .setThumbnail(user.avatarURL)
                .addField("Bank: ", "$" + fixedbank)
                .addField("Cash: ", "$" + fixedcash)
                .addField("Net Worth: ", "$" + fixednetworth);
            message.channel.send(embed);
        })
    }
}

exports.conf = {
    guildOnly: true,
    aliases: ['bal'],
    commandCategory: 'economy'
};

exports.help = {
    name: 'balance',
    description: 'Lets you view all the money you have currently.',
    usage: 'balance <amount>'
};