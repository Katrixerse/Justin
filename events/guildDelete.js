const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
module.exports = (client, guild, message) => {
    console.log(`Someone removed MrGoodBot from their discord! ${guild.name} Member count: ${guild.memberCount} owned by: ${guild.owner.user.username}!`)
    sql.run(`DELETE FROM guild_prefix WHERE guildId = ${guild.id}`);
}