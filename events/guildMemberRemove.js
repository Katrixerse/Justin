const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
module.exports = (client, member, guild) => {
  if (member.user.bot) return;
  sql.get(`SELECT hz.wl_enabled, hz.leave_message, hz.wl_channel, hy.role_persist_enabled FROM guild_wl_system as hz left join guild_misc_settings as hy on hy.guildId = hz.guildId WHERE hz.guildId ="${member.guild.id}"`).then(async row => {
    const test = member.roles.map(r => r.name).join(" ")
    const testfix = test.replace('@everyone, ', '')
    if (row.role_persist_enabled === 'enabled') {
      sql.get(`SELECT * FROM user_roles WHERE guildId = "${member.guild.id}" AND userId ="${member.user.id}"`).then(row2 => {
        if (!row2) return;
        if (row2.roles === test) return;
        if (row2.roles === testfix) return;
        sql.run(`UPDATE user_roles SET roles = "${testfix}" WHERE guildId ="${member.guild.id}" AND userId ="${member.user.id}"`);
      }).catch(() => {
        sql.run("CREATE TABLE IF NOT EXISTS user_roles (guildId TEXT, userId TEXT, roles TEXT)").then(() => {
          sql.run("INSERT INTO user_roles (guildId, userId, roles) VALUES (?, ?, ?)", [member.guild.id, member.user.id, `${testfix}`]);
        });
      });
    }
    if (row.wl_enabled === "enabled") {
      try {
        const welcomeChannel = member.guild.channels.find(n => n.name === row.wl_channel);
        if (!welcomeChannel) return
        let WelcomeMess = row.leave_message;
        var WelcomeFix = WelcomeMess.replace("%server.name%", member.guild.name).replace("%user.name%", member.user.username).replace("%server.memberCount%", member.guild.memberCount);
        client.channels.get(welcomeChannel.id).send(WelcomeFix)
      } catch (err) {
        console.log(err)
      }
    }
  })
}