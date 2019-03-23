const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    sql.get(`SELECT cash FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
        const usage = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setThumbnail(client.user.avatarURL)
            .addField("Usage: ", ">roll <number> <amount/bet>")
            .addField("Example: ", ">roll 99 1000");
        var dice = Math.floor(Math.random() * 110.99 + 1);
        var number = parseInt(args.join(''));
        const wonamount = (Math.round(number * 2));
        if (number.length < 1) return message.channel.send(usage);
        if (row.cash < number) return message.channel.send(`You dont have enough money to bet that much, you have: $${row.cash}`);
        if (number < -0) return message.channel.send(`You can't bet anything below 0: you tried to bet $${number}.`);
        if (!isFinite(number)) return message.channel.send(`${number} is not a valid number to bet.`);
        if (isNaN(number)) return message.channel.send(`${number} is not a valid number to bet.`);
        if (number.length > 7) return message.channel.send("Can not bet more than 8 figures at a time.");
        if (dice >= "99") {
            const embed = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTimestamp()
                .setTitle(`The dice has rolled: ${dice}`)
                .setDescription(`You have won $${wonamount}!`)
                .setThumbnail("http://www.pngall.com/wp-content/uploads/2016/04/Dice-Free-Download-PNG.png");
            sql.run(`UPDATE user_profiles SET cash = ${row.cash += wonamount} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
            message.channel.send(embed).catch(console.error);
        } else {
            const embed2 = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTimestamp()
                .setTitle(`The dice has rolled: ${dice}`)
                .setDescription(`You have lost $${number}!`)
                .setThumbnail("http://www.pngall.com/wp-content/uploads/2016/04/Dice-Free-Download-PNG.png");
            sql.run(`UPDATE user_profiles SET cash = ${row.cash -= number} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
            message.channel.send(embed2).catch(console.error);
        }
    })
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'economy'
};

exports.help = {
    name: '50',
    description: 'Rolls the dice if you get above 75 you win 1.75x your bet.',
    usage: '50 <amount>'
};