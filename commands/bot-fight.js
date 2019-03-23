const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    sql.get(`SELECT cash, winningchance FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
        if (row.winningchance >= 98) {
            sql.run(`UPDATE user_profiles SET winningchance = ${row.winningchance = 0} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
          }
    const usage = new Discord.RichEmbed()
    .setColor(0x00A2E8)
    .setThumbnail(client.user.avatarURL)
    .addField("Usage: ", "j!bot-fight <amount/bet>")
    .addField("Example: ", "j!bot-fight 1000");
    var losechance = 49 - row.winningchance;
    var winchance = 50 + row.winningchance;

    var fruits=["win", "lose"]
    var fruitweight=[winchance, losechance] //weight of each element above
    var totalweight=eval(fruitweight.join("+")) //get total weight (in this case, 10)
    var weighedfruits=new Array() //new array to hold "weighted" fruits
    var currentfruit=0
     
    while (currentfruit<fruits.length){ //step through each fruit[] element
        for (i=0; i<fruitweight[currentfruit]; i++)
            weighedfruits[weighedfruits.length]=fruits[currentfruit]
        currentfruit++
    }

    var randomnumber=Math.floor(Math.random()*totalweight)
    var number = parseInt(args[0]);
    const wonamount = (Math.round(number * 2))
    if (number.length < 1) return message.channel.send(usage);
    if (row.cash < number) return message.channel.send("You dont have enough money to bet that much, you have: $" + row.cash);
    if (number < -0) return message.channel.send("You can't bet anything below 0: you bet $" + number)
    if (!isFinite(number)) return message.channel.send("You can't bet nothing.")
    if (isNaN(number)) return message.channel.send(number + "is not a valid number to bet");
    if (number.length > 7) return message.channel.send("Can not bet more then 7 numbers at a time")
    if (randomnumber > winchance) {
      const embed = new Discord.RichEmbed()
      .setColor(0x00A2E8)
      .setTimestamp()
      .setTitle("Your bot won!")
      .setDescription("You gained $" + wonamount + "!\nBot gained some experince and chances of winning increased to " + (row.winningchance + 51) + "%")
      .setThumbnail("https://vgy.me/JQHa4g.png")
      sql.run(`UPDATE user_profiles SET cash = ${row.cash += wonamount}, winningchance = ${row.winningchance += 1} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
      message.channel.send(embed).catch(console.error);
    } else {
        const embed2 = new Discord.RichEmbed()
        .setColor(0x00A2E8)
        .setTimestamp()
        .setTitle("Your bot lost!")
        .setDescription("You have lost $" + number + "!\nBot chances of winning are back at 50%")
        .setThumbnail("https://vgy.me/JQHa4g.png")
        if (row.winningchance >= 1) {
            sql.run(`UPDATE user_profiles SET cash = ${row.cash -= number}, winningchance = ${row.winningchance = 0} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
        }
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
    name: 'bot-fight',
    description: 'Win bot fights and you win 2x your bet.',
    usage: 'bot-fight <amount>'
};
