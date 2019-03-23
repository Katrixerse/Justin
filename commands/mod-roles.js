const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
  message.channel.send('```Which Option would you like to use?\n\n[1] - Add mod role.\n[2] - Remove mod role.\n[3] - View current mod roles.\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
    .then(() => {
      message.channel.awaitMessages(m => m.author.id === message.author.id, {
          max: 1,
          time: 30000,
          errors: ['time'],
        })
        .then((resp) => {
          if (!resp) return;
          resp = resp.array()[0];
          if (resp.content === '1') {
            message.channel.send('```Which role would you like to add?\n\nType the role name.\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
              .then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                  })
                  .then((resp) => {
                    if (!resp) return;
                    resp = resp.array()[0];
                    if (resp.content.length > 25) return message.channel.send('Can only add roles that are 25 characters or less.');
                    let role = client.guilds.get(message.guild.id).roles.find(role => role.name === resp.content);
                    if (!role) return message.channel.send(`${role} is not a valid role.`);
                    //const role_name = role.toString().replace('<@', '').replace('>', '').replace('&', '');
                    sql.get(`SELECT * FROM guild_moderation_settings WHERE guildId ="${message.guild.id}"`).then(row => {
                      if (!row) return;
                      if (row.mod_roles.length >= 300) return message.channel.send("Have hit the max roles that you can set please remove one and try again.")
                      if (row.mod_roles === 'none-set' || row.mod_roles === '') {
                        sql.run(`UPDATE guild_moderation_settings SET mod_roles = "${role}" WHERE guildId = "${message.guild.id}"`);
                        message.channel.send("***" + role + " has been successfully added! :white_check_mark:***");
                      } else {
                        sql.run(`UPDATE guild_moderation_settings SET mod_roles = "${row.mod_roles},${role}" WHERE guildId = "${message.guild.id}"`);
                        message.channel.send("***" + role + " has been successfully added! :white_check_mark:***");
                      }
                    })
                  }).catch((err) => {
                    if (err.message === undefined) {
                      message.channel.send('You provided no input in the time limit, please try again.')
                    } else {
                      console.log(err)
                      return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                    }
                  });
              }).catch((err) => {
                if (err.message === undefined) {
                  message.channel.send('You provided no input in the time limit, please try again.')
                } else {
                  console.log(err)
                  return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                }
              });
          } else if (resp.content === '2') {
            message.channel.send('```Which role would you like to remove?\n\nType the role name or all to remove all roles.\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
              .then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                  })
                  .then((resp) => {
                    if (!resp) return;
                    resp = resp.array()[0];
                    if (resp.content === 'all') {
                      sql.run(`UPDATE guild_moderation_settings SET mod_roles = "none-set" WHERE guildId = ${message.guild.id}`);
                      message.channel.send("***All mod roles have been successfully removed! :white_check_mark:***");
                    } else {
                      sql.get(`SELECT mod_roles FROM guild_moderation_settings WHERE guildId ="${message.guild.id}"`).then(row => {
                        if (!row || row.mod_roles === '') return message.channel.send('Need to add mod roles first.');
                        sql.run(`UPDATE guild_moderation_settings SET mod_roles = "${row.mod_roles.split(resp.content.toLowerCase() + ',').pop()}" WHERE guildId = ${message.guild.id}`);
                        message.channel.send("***" + role + " has been successfully removed! :white_check_mark:***");
                      })
                    }
                  }).catch((err) => {
                    if (err.message === undefined) {
                      message.channel.send('You provided no input in the time limit, please try again.')
                    } else {
                      console.log(err)
                      return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                    }
                  });
              }).catch((err) => {
                if (err.message === undefined) {
                  message.channel.send('You provided no input in the time limit, please try again.')
                } else {
                  console.log(err)
                  return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                }
              });
          } else if (resp.content === '3') {
            sql.get(`SELECT mod_roles FROM guild_moderation_settings WHERE guildId ="${message.guild.id}"`).then(row => {
              message.channel.send(`Current mod roles are: ${row.mod_roles}`);
            })
          }
        })
    })
}

exports.conf = {
  guildOnly: true,
  aliases: [],
  commandCategory: 'moderation'
};

exports.help = {
  name: 'mod-roles',
  description: 'Allows guild owner to add mods so they can mod commands without needing perms.',
  usage: 'mod-roles'
};