const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_ROLES", false, true, true)) return message.channel.send("You're missing MANAGE_ROLES permission")
    sql.get(`SELECT mod_logs_channel, mod_logs_enabled FROM guild_moderation_settings WHERE guildId ="${message.guild.id}"`).then(row => {
        var userz = message.guild.members.array();
        const roletogive = args.join(' ')
        let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
        let subscriberRole = client.guilds.get(message.guild.id).roles.find(n => n.name == roletogive);
        if (!subscriberRole) return message.channel.send("I can not find the role " + roletogive + " :x:");
        if (subscriberRole.position >= message.member.highestRole.position) return message.reply('I cant give members that role. Its the same level as you or higher. :x:');
        if (subscriberRole.position >= message.guild.member(client.user).highestRole.position) return message.reply(`Can't give roles that are the same level as me or higher. :x:`);

        if (row.logsenabled === 'disabled') {
            try {
                userz.forEach(u => {
                    u.removeRole(subscriberRole)
                })
                message.channel.send("I have taken the role " + roletogive + " from all members.")
               return client.channels.get(modlog.id).send(embed);
            } catch (err) {
                return;
            }
        } else {
            try {
                message.channel.send("I have taken the role " + roletogive + " to all members.")
                const embed = new Discord.RichEmbed()
                    .setColor(0x00A2E8)
                    .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                    .addField("Role taken:", roletogive)
                    .setFooter("Time used: " + message.createdAt.toDateString())
                if (!modlog) return;
                return client.channels.get(modlog.id).send(embed);
            } catch (err) {
                return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
            }
        }
    })
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'role-all',
    description: 'Gives all users the same role [This can take awhile depending how many users you have].',
    usage: 'role-all [rolenmae]'
};