const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
module.exports = client => {
   console.log('I\'m Online');
   const servercount = client.guilds.size;
   client.user.setActivity(`j!help | ${servercount.toLocaleString()} Servers.`)
   sql.get(`SELECT * FROM bot_settings`).then(row => {
      if (!row) {
        sql.run(`INSERT INTO bot_settings (maintenance_mode, maintenance_reason) VALUES (?, ?)`, ['none', `NA`]);
      }
    }).catch(() => {
      sql.run(`CREATE TABLE IF NOT EXISTS bot_settings (maintenance_mode TEXT, maintenance_reason TEXT)`).then(() => {
         sql.run(`INSERT INTO bot_settings (maintenance_mode, maintenance_reason) VALUES (?, ?)`, ['none', `NA`]);
      });
    });
}