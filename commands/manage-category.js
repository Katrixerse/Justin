const Discord = require('discord.js')
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
  if (!message.member.hasPermission(`MANAGE_GUILD`, false, true, true)) return message.channel.send(`You need the ADMINISTRATOR permission to use this command.`);
  const helpembed = new Discord.RichEmbed()
    .setColor(0x6B363E)
    .addField('Which command setting would you like to use?', '```\n[1] - Enable command category\n[2] - Disable command category\n\n# Type the number to see the page.\n# Type exit to leave this menu.```')
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
            message.channel.send('Which command category would you like to enable?').then(() => {
              message.channel.awaitMessages(m => m.author.id === message.author.id, {
                  max: 1,
                  time: 30000,
                  errors: ['time'],
                })
                .then((resp) => {
                  if (!resp) return;
                  resp = resp.array()[0];
                  sql.get(`SELECT * FROM guild_disabled_categories WHERE guildId ="${message.guild.id}"`).then(row1 => {
                    if (resp.content.includes("moderation")) {
                        if (!row1.categoriesDisabled.includes(`moderation`)) return message.channel.send(`Moderation is not a locked category.`);
                        sql.run(`UPDATE guild_disabled_categories SET categoriesDisabled = "${row1.categoriesDisabled.split("moderation").pop()}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send(`Locked categories updated.`);
                    } else if (resp.content.includes("fun")) {
                        if (!row1.categoriesDisabled.includes(`fun`)) return message.channel.send(`Fun is not a locked category.`);
                        sql.run(`UPDATE guild_disabled_categories SET categoriesDisabled = "${row1.categoriesDisabled.split("fun").pop()}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send(`Locked categories updated.`);
                    } else if (resp.content.includes("roleplay")) {
                        if (!row1.categoriesDisabled.includes(`roleplay`)) return message.channel.send(`Roleplay is not a locked category.`);
                        sql.run(`UPDATE guild_disabled_categories SET categoriesDisabled = "${row1.categoriesDisabled.split("roleplay").pop()}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send(`Locked categories updated.`);
                    } else if (resp.content.includes("misc")) {
                        if (!row1.categoriesDisabled.includes(`misc`)) return message.channel.send(`Misc is not a locked category.`);
                        sql.run(`UPDATE guild_disabled_categories SET categoriesDisabled = "${row1.categoriesDisabled.split("misc").pop()}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send(`Locked categories updated.`);
                    } else if (resp.content.includes("music")) {
                        if (!row1.categoriesDisabled.includes(`music`)) return message.channel.send(`Music is not a locked category.`);
                        sql.run(`UPDATE guild_disabled_categories SET categoriesDisabled = "${row1.categoriesDisabled.split("music").pop()}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send(`Locked categories updated.`);
                    } else if(resp.content.includes('economy')) {
                        if (!row1.categoriesDisabled.includes(`economy`)) return message.channel.send(`Economy is not a locked category.`);
                        sql.run(`UPDATE guild_disabled_categories SET categoriesDisabled = "${row1.categoriesDisabled.split("economy").pop()}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send(`Locked categories updated.`);
                    } else if(resp.content.includes('nsfw')) {
                        if (!row1.categoriesDisabled.includes(`nsfw`)) return message.channel.send(`Nsfw is not a locked category.`);
                        sql.run(`UPDATE guild_disabled_categories SET categoriesDisabled = "${row1.categoriesDisabled.split("nsfw").pop()}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send(`Locked categories updated.`);
                      } else if(resp.content.includes('search')) {
                        if (!row1.categoriesDisabled.includes(`search`)) return message.channel.send(`Nsfw is not a locked category.`);
                        sql.run(`UPDATE guild_disabled_categories SET categoriesDisabled = "${row1.categoriesDisabled.split("nsfw").pop()}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send(`Locked categories updated.`);
                    } else {
                        message.channel.send(`${resp.content} is not a valid category to unlock.`);
                    }
                });
                }).catch((err) => {
                    console.log(err)
                });
            })
          } else if (resp.content === '2') {
            message.channel.send('Which command category would you like to disable?').then(() => {
              message.channel.awaitMessages(m => m.author.id === message.author.id, {
                  max: 1,
                  time: 30000,
                  errors: ['time'],
                })
                .then((resp) => {
                  if (!resp) return;
                  resp = resp.array()[0];
                  sql.get(`SELECT * FROM guild_disabled_categories WHERE guildId ="${message.guild.id}"`).then(row1 => {

                    if (resp.content.includes("moderation")) {
                        if (row1.categoriesDisabled.includes(`moderation`)) return message.channel.send(`Moderation is already a locked category.`);
                        sql.run(`UPDATE guild_disabled_categories SET categoriesDisabled = "${row1.categoriesDisabled + "moderation"}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send(`Locked categories updated.`);
                      } else if (resp.content.includes("fun")) {
                        if (row1.categoriesDisabled.includes(`fun`)) return message.channel.send(`Fun is already a locked category.`);
                        sql.run(`UPDATE guild_disabled_categories SET categoriesDisabled = "${row1.categoriesDisabled + "fun"}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send(`Locked categories updated.`);
                      } else if (resp.content.includes("roleplay")) {
                        if (row1.categoriesDisabled.includes(`roleplay`)) return message.channel.send(`Roleplay is already a locked category.`);
                        sql.run(`UPDATE guild_disabled_categories SET categoriesDisabled = "${row1.categoriesDisabled + "roleplay"}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send(`Locked categories updated.`);
                      } else if (resp.content.includes("misc")) {
                        if (row1.categoriesDisabled.includes(`misc`)) return message.channel.send(`Misc is already a locked category.`);
                        sql.run(`UPDATE guild_disabled_categories SET categoriesDisabled = "${row1.categoriesDisabled + "misc"}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send(`Locked categories updated.`);
                      } else if (resp.content.includes("music")) {
                        if (row1.categoriesDisabled.includes(`music`)) return message.channel.send(`Music is already a locked category.`);
                        sql.run(`UPDATE guild_disabled_categories SET categoriesDisabled = "${row1.categoriesDisabled + "music"}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send(`Locked categories updated.`);
                      } else if(resp.content.includes("economy")) {
                        if (row1.categoriesDisabled.includes(`economy`)) return message.channel.send(`Economy is already a locked category.`);
                        sql.run(`UPDATE guild_disabled_categories SET categoriesDisabled = "${row1.categoriesDisabled + "economy"}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send(`Locked categories updated.`);
                      } else if(resp.content.includes("nsfw")) {
                        if (row1.categoriesDisabled.includes(`nsfw`)) return message.channel.send(`Nsfw is already a locked category.`);
                        sql.run(`UPDATE guild_disabled_categories SET categoriesDisabled = "${row1.categoriesDisabled + "nsfw"}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send(`Locked categories updated.`);
                      } else {
                        message.channel.send(`${resp.content} is not a valid category to lock.`);
                      }
                  });
                }).catch((err) => {
                  console.log(err)
                });
            })
          } else {
            return message.channel.send("Cancelled manage-category command.")
          }
        });
    })
}

exports.conf = {
  guildOnly: true,
  aliases: ['mcc', 'm-cc'],
  commandCategory: 'moderation'
};

exports.help = {
  name: 'manage-category',
  description: 'Can enable and disable certain command categories.',
  usage: 'manage-category'
};