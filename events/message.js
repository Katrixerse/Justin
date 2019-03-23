const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  sql.get(`SELECT gp.prefix, gq.mod_only_enabled, gq.mod_roles, gz.commandsDisabled, gy.categoriesDisabled FROM guild_prefix as gp left join guild_moderation_settings as gq on gp.guildId = gq.guildId left join guild_disabled_commands as gz on gp.guildId = gz.guildId left join guild_disabled_categories as gy on gp.guildId = gy.guildId WHERE gp.guildId = '${message.guild.id}'`).then(row => {
    let prefix = row.prefix
    let queue = row.queue
    let mod_roles = row.mod_roles
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (row.commandsDisabled.includes(command)) return;
    if (row.mod_only_enabled === "enabled" && !message.member.hasPermission("KICK_MEMBERS", false, true, true) && !message.member.roles.map((e) => e).join(',').toString().includes(mod_roles)) return;
    let cmd;
      if (client.commands.has(command)) {
        cmd = client.commands.get(command);
      } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
      }
      if (cmd) {
        if (row.categoriesDisabled.includes(cmd.conf.commandCategory)) return;
        console.log(`[Justin] [${message.guild.name}] [${message.author.username}] ${prefix}${command} ${args}`);
        cmd.run(client, message, args, mod_roles);
      }
    })
};