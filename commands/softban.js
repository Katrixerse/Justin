const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args, mod_roles) => {
    if (!message.member.hasPermission("KICK_MEMBERS", false, true, true) && !message.member.roles.map((e) => e).join(',').toString().includes(mod_roles)) return message.reply('Sorry, you\'re missing the required permission to run this command, need KICK_MEMBERS. :x:');
    sql.get(`SELECT gp.prefix, gz.casenumber, gz.mod_logs_enabled, gz.mod_logs_channel FROM guild_prefix as gp left join guild_moderation_settings as gz on gp.guildId = gz.guildId WHERE gp.guildId = '${message.guild.id}'`).then(row => {
        const prefixtouse = row.prefix;
        const usage = new Discord.RichEmbed()
            .setColor(0x6B363E)
            .setThumbnail(client.user.avatarURL)
            .setTitle("Command: " + prefixtouse + "softban")
            .addField("Usage", prefixtouse + "softban @Someone <reason>")
            .addField("Example", prefixtouse + "softban @Someone trying to start trouble.")
            .setDescription("Description: " + "Bans and unbans a user from the current server");

            if (!message.guild.member(client.user).hasPermission('KICK_MEMBERS')) return message.reply('Sorry, i dont have the perms to do this cmd i need KICK_MEMBERS. :x:');
            let reason = args.slice(1).join(' ') || `Moderator didn't give a reason.`;
            if (message.mentions.users.size < 1) return message.channel.send(usage);
            let user = message.guild.member(message.mentions.users.first());
            if (user.highestRole.position >= message.member.highestRole.position) return message.reply('I cant softban that member. They are the same level as you or higher. :x:');
            let modlog = message.guild.channels.find(channel => channel.name == row.mod_logs_channel);
            if (!message.guild.member(user).bannable) return message.reply('This member is not banable. Perhaps they have a higher role than me?');
            if (reason.length < 1) return;
            message.channel.send("***The User has been successfully been soft banned! :white_check_mark:***");
            message.guild.ban(user, 2);
            message.guild.unban(user, 2);
            sql.run(`UPDATE guild_moderation_settings SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
            const embed = new Discord.RichEmbed()
                .setColor(0x6B363E)
                .setTitle("Case #" + row.casenumber + " | Action: Soft Ban")
                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                .addField("User", user.user.tag + " (ID: " + user.user.id + ")")
                .addField("Reason", reason, true)
                .setFooter("Time used: " + message.createdAt.toDateString());
            if (!modlog) return;
            if (row.mod_logs_enabled === "disabled") return;
            return client.channels.get(modlog.id).send(embed);
    })
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'softban',
    description: 'Allows you to ban then instantly unban the user.',
    usage: 'softban @User [reason]'
};