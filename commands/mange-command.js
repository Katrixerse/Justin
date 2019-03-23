const Discord = require('discord.js')
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
  if (!message.member.hasPermission(`MANAGE_GUILD`, false, true, true)) return message.channel.send(`You need the ADMINISTRATOR permission to use this command.`);
  const helpembed = new Discord.RichEmbed()
    .setColor(0x6B363E)
    .addField('Which command setting would you like to use?', '```\n[1] - Enable command\n[2] - Disable command\n\n# Type the number to see the page.\n# Type exit to leave this menu.```')
  message.channel.send(helpembed)
    .then(() => {
      message.channel.awaitMessages(m => m.author.id === message.author.id, {
          max: 1,
          time: 30000,
          errors: ['time'],
        })
        .then((resp) => {
          if (!resp) return;
          resp = resp.array()[0];
          if (resp.content === "1") {
            message.channel.send('Which command would you like to enable?').then(() => {
              message.channel.awaitMessages(m => m.author.id === message.author.id, {
                  max: 1,
                  time: 30000,
                  errors: ['time'],
                })
                .then((resp) => {
                  if (!resp) return;
                  resp = resp.array()[0];
                  sql.get(`SELECT * FROM guild_disabled_categories WHERE guildId ="${message.guild.id}"`).then(row => {
                    sql.get(`SELECT * FROM guild_disabled_commands WHERE guildId ="${message.guild.id}"`).then(async row1 => {
                      if (row.categoriesDisabled.includes(`moderation`)) return;
                      let commandtodisable = resp.content;
                      if (!commandtodisable) return message.channel.send(`Please provide a command to enable.`);
                      if (!row1.commandsDisabled.includes(commandtodisable)) return message.channel.send(`Command is already enabled.`);
                      let cmd = client.commands.get(commandtodisable);
                      if (!cmd) return message.channel.send(`No such command ${commandtodisable}`);
                      sql.run(`UPDATE guild_disabled_commands SET commandsDisabled = "${row1.commandsDisabled.split(commandtodisable).pop()}" WHERE guildId = ${message.guild.id}`);
                      return message.channel.send(`Disabled commands updated.`)
                    });
                  });
                }).catch((err) => {
                  console.log(err)
                });
            })
          } else if (resp.content === '2') {
            message.channel.send('Which command would you like to disable?').then(() => {
              message.channel.awaitMessages(m => m.author.id === message.author.id, {
                  max: 1,
                  time: 30000,
                  errors: ['time'],
                })
                .then((resp) => {
                  if (!resp) return;
                  resp = resp.array()[0];
                  sql.get(`SELECT * FROM guild_disabled_categories WHERE guildId ="${message.guild.id}"`).then(row => {
                    sql.get(`SELECT * FROM guild_disabled_commands WHERE guildId ="${message.guild.id}"`).then(async row1 => {
                      if (row.categoriesDisabled.includes(`moderation`)) return;
                      let commandtodisable = resp.content;
                      if (!commandtodisable) return message.channel.send(`Please provide a command to disable.`);
                      if (commandtodisable == `manage-command` || commandtodisable == `mc` || commandtodisable == `m-c`) return message.channel.send(`Cannot disable "disablecommand".`);
                      if (commandtodisable == `kickall` && message.author.id !== message.guild.owner.id) return message.channel.send(`Cannot disable kickall if you are not the owner.`);
                      if (row1.commandsDisabled.includes(commandtodisable)) return message.channel.send(`Command is already disabled.`);
                      let cmd = client.commands.get(commandtodisable);
                      if (!cmd) return message.channel.send(`No such command ${commandtodisable}`);
                      sql.run(`UPDATE guild_disabled_commands SET commandsDisabled = "${row1.commandsDisabled + commandtodisable}" WHERE guildId = ${message.guild.id}`);
                      return message.channel.send(`Disabled commands updated.`)
                    });
                  });
                }).catch((err) => {
                  console.log(err)
                });
            })
          } else {
            return message.channel.send("Cancelled manage-command.")
          }
        });
    })
}

exports.conf = {
  guildOnly: true,
  aliases: ['mc', 'm-c'],
  commandCategory: 'moderation'
};

exports.help = {
  name: 'manage-command',
  description: 'Can enable and disable certain commands.',
  usage: 'manage-command'
};