const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD", false, true, true)) return message.reply('Sorry, you\'re missing the required permission to use this command you need MANAGE_GUILD. :x:');
    message.channel.send('```Which Option would you like to use?\n\n[1] - Set password.\n[2] - Set password uses.\n[3] - Enable/Disable server password.\n[4] - Set password role.\n[5] - View current password\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
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
            message.channel.send('```What would you like the password to be?\n\nType the password you want users to be asked when joining the guild.\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
              .then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                  })
                  .then((resp) => {
                    if (!resp) return;
                    resp = resp.array()[0];
                    let new_password = resp.content
                    if (new_password.length >= 30) return message.channel.send('The password can\'t be 30 or more characters.');
                    sql.run(`UPDATE guild_pass_settings SET guild_password = "${new_password}" WHERE guildId = ${message.guild.id}`);
                    message.channel.send("***" + new_password + " has been set and now new users that join will be asked to enter it! :white_check_mark:***");
                  }).catch((err) => {
                    if (err.message === undefined) {
                      message.channel.send('You provided no input in the time limit, please try again.');
                    } else {
                      console.log(err)
                      return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                    }
                  });
              }).catch((err) => {
                if (err.message === undefined) {
                  message.channel.send('You provided no input in the time limit, please try again.');
                } else {
                  console.log(err)
                  return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                }
              });
          } else if (resp.content === '2') {
            message.channel.send('```How many times would you like the password to be used?\n\nType the amount you want [0 for infinite uses].\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
              .then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                  })
                  .then((resp) => {
                    if (!resp) return;
                    resp = resp.array()[0];
                    let pass_uses = parseInt(resp.content);
                    if (pass_uses.length >= 30) return message.channel.send('The password can\'t be 30 or more characters.');
                    sql.run(`UPDATE guild_pass_settings SET password_uses = ${pass_uses} WHERE guildId = ${message.guild.id}`);
                    message.channel.send("***" + pass_uses + " has been set and now new users that join will be asked to enter it! :white_check_mark:***");
                  }).catch((err) => {
                    if (err.message === undefined) {
                      message.channel.send('You provided no input in the time limit, please try again.');
                    } else {
                      console.log(err)
                      return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                    }
                  });
              }).catch((err) => {
                if (err.message === undefined) {
                  message.channel.send('You provided no input in the time limit, please try again.');
                } else {
                  console.log(err)
                  return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                }
              });
          } else if (resp.content === '3') {
            sql.get(`SELECT guild_pass_enabled FROM guild_pass_settings WHERE guildId ="${message.guild.id}"`).then(row => {
              if (row.guild_pass_enabled === 'enabled') {
                sql.run(`UPDATE guild_pass_settings SET guild_pass_enabled = "disabled" WHERE guildId = ${message.guild.id}`);
                message.channel.send("*** Server pass has been disabled successfully! :white_check_mark:***");
              } else {
                sql.run(`UPDATE guild_pass_settings SET guild_pass_enabled = "enabled" WHERE guildId = ${message.guild.id}`);
                message.channel.send("*** Server pass has been enabled successfully! :white_check_mark:***");
              }
            })
          } else if (resp.content === '4') {
            message.channel.send('```How many times would you like the password to be used?\n\nType the amount you want.\n\n# Type the number to see the option.\n# Type exit to leave this menu.```')
            .then(() => {
              message.channel.awaitMessages(m => m.author.id === message.author.id, {
                  max: 1,
                  time: 30000,
                  errors: ['time'],
                })
                .then((resp) => {
                  if (!resp) return;
                  resp = resp.array()[0];
                  let role_name = resp.content;
                  if (role_name.length > 25) return message.channel.send('Can only add roles that are 25 characters or less.');
                  let role = client.guilds.get(message.guild.id).roles.find(role => role.name === role_name);
                  if (!role) return message.channel.send(`Could not find the role: ${role_name}.`)
                  sql.run(`UPDATE guild_pass_settings SET password_role = "${role_name}" WHERE guildId = ${message.guild.id}`);
                  message.channel.send("*** Server pass role has been successfully changed! :white_check_mark:***");
                })
              })
          } else if (resp.content === '5') {
            sql.get(`SELECT guild_password, password_uses, password_role FROM guild_self_roles WHERE guildId ="${message.guild.id}"`).then(row => {
              message.channel.send(`***Current password is: ${row.guild_password} has ${row.password_uses}uses left and the role given ${row.password_role}! :white_check_mark:***`);
            })
          } else {
            message.channel.send('Server-pass command cancelled.');
          }
        }).catch((err) => {
          if (err.message === undefined) {
            message.channel.send('You provided no input in the time limit, please try again.');
          } else {
            console.log(err)
            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
          }
        });
    }).catch((err) => {
      if (err.message === undefined) {
        message.channel.send('You provided no input in the time limit, please try again.');
      } else {
        console.log(err)
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
      }
    });
}

exports.conf = {
  guildOnly: false,
  aliases: ['server-password'],
  commandCategory: 'moderation'
};

exports.help = {
  name: 'server-pass',
  description: 'Lets you set a password for the guild.',
  usage: 'server-pass'
};