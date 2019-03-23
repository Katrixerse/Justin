const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = async (client, message, args) => {
    //sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(async row2 => {
    //if (!row2) return;
    // (row2.levelsystem === "disabled") return message.channel.send("Level system has been disabled for this guild.");
    if (message.mentions.users.size < 1) {
        sql.get(`SELECT count(bank) as total_bank FROM user_profiles WHERE guildId ="${message.guild.id}"`).then( row => {
            if (!row) return message.channel.send("Need to start talking first!");
            const fixedbank = row.total_bank.toLocaleString('en');
            const embed = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTitle("Total server's money.")
                .setThumbnail(message.author.avatarURL)
                .addField("Bank: ", `$${fixedbank}`);
            return message.channel.send(embed);
        })
    }
    //})
}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'economy'
};

exports.help = {
    name: 'bank',
    description: 'Lets you view all the money you have currently.',
    usage: 'bank'
};