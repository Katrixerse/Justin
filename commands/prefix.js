const Discord = require('discord.js')
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD", false, true, true)) return message.channel.send("You require the permission **MANAGE_GUILD** to use this command.");
    if (args.join(' ').length > 1) {
        const newprefix = args[0];
        if (newprefix < 1) return message.channel.send("Didn't provide a new prefix to set.");
        if (newprefix.length > 5) return message.channel.send("The new prefix can't be longer than 5 characters.");
        const newprefixfix = newprefix.replace("[^\\x00-\\x7F]", "").replace("[^\\x20-\\x7E]", "").replace('/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g,', '').replace("``", "").replace("**", "").replace('""', '');
        if (newprefixfix.length < 1) return message.channel.send("Prefix can't have ascii characters")
        sql.get(`SELECT prefix FROM guild_prefix WHERE guildId ="${message.guild.id}"`).then(row => {
            if (row.prefix === args[0]) return message.channel.send(`Prefix is already set too: ${args[0]}, please try again.`);
            sql.run(`UPDATE guild_prefix SET prefix = "${newprefixfix}" WHERE guildId = ${message.guild.id}`);
            message.channel.send("I have set the new guild prefix to " + newprefix)
            let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
            const embed = new Discord.RichEmbed()
                .setColor(0x6B363E)
                //.setTitle("Case #" + row.casenumber + " | Action: Prefix Change")
                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                .addField("New prefix", newprefixfix, true)
                .setFooter("Time used: " + message.createdAt.toDateString())
            if (!modlog) return;
            if (row.logsenabled === "disabled") return;
            return client.channels.get(modlog.id).send({
                embed
            });
        })
    } else {
        message.channel.send('What would you like the new prefix to be?').then(() => {
            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                })
                .then((resp) => {
                    if (!resp) return;
                    resp = resp.array()[0];
                    if (resp.content === "exit") {
                        return message.channel.send('Prefix command has been cancelled.')
                    } else {
                        const newprefix = resp.content;
                        if (newprefix < 1) return message.channel.send("Didn't provide a new prefix to set.");
                        if (newprefix.length > 5) return message.channel.send("The new prefix can't be longer than 5 characters.");
                        const newprefixfix = newprefix.replace("[^\\x00-\\x7F]", "").replace("[^\\x20-\\x7E]", "").replace('/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g,', '').replace("``", "").replace("**", "").replace('""', '');
                        if (newprefixfix.length < 1) return message.channel.send("Prefix can't have ascii characters")
                        sql.get(`SELECT prefix FROM guild_prefix WHERE guildId ="${message.guild.id}"`).then(row => {
                            if (row.prefix === args[0]) return message.channel.send(`Prefix is already set too: ${args[0]}, please try again.`);
                            sql.run(`UPDATE guild_prefix SET prefix = "${newprefixfix}" WHERE guildId = ${message.guild.id}`);
                            message.channel.send("I have set the new guild prefix to " + newprefix)
                            let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
                            const embed = new Discord.RichEmbed()
                                .setColor(0x6B363E)
                                //.setTitle("Case #" + row.casenumber + " | Action: Prefix Change")
                                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                                .addField("New prefix", newprefixfix, true)
                                .setFooter("Time used: " + message.createdAt.toDateString())
                            if (!modlog) return;
                            if (row.logsenabled === "disabled") return;
                            return client.channels.get(modlog.id).send({
                                embed
                            });
                        })
                    }
                })
        })
    }
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'prefix',
    description: 'Changes the guilds prefix.',
    usage: 'prefix [new prefix]'
};