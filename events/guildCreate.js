const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
module.exports = (client, guild, message) => {
    // guilds prefix
    sql.get(`SELECT * FROM guild_prefix WHERE guildId ="${guild.id}"`).then(row => {
        if (!row) {
          sql.run(`INSERT INTO guild_prefix (guildId, prefix) VALUES (?, ?)`, [guild.id, `j!`]);
        }
      }).catch(() => {
        sql.run(`CREATE TABLE IF NOT EXISTS guild_prefix (guildId TEXT, prefix TEXT)`).then(() => {
          sql.run(`INSERT INTO guild_prefix (guildId, prefix) VALUES (?, ?)`, [guild.id, `j!`]);
        });
      });
      // guilds music queue
      sql.get(`SELECT * FROM guild_queue WHERE guildId ="${guild.id}"`).then(row => {
        if (!row) {
          sql.run(`INSERT INTO guild_queue (guildId, queue) VALUES (?, ?)`, [guild.id, "no queue"]);
        }
      }).catch(() => {
        sql.run(`CREATE TABLE IF NOT EXISTS guild_queue (guildId TEXT, queue TEXT)`).then(() => {
          sql.run(`INSERT INTO guild_queue (guildId, queue) VALUES (?, ?)`, [guild.id, 'no queue']);
        });
      });
      // Disabled categories
      sql.get(`SELECT * FROM guild_disabled_categories WHERE guildId ="${guild.id}"`).then(row => {
        if (!row) {
          sql.run("INSERT INTO guild_disabled_categories (guildId, categoriesDisabled) VALUES (?, ?)", [guild.id, 'none']);
        }
      }).catch(() => {
        sql.run("CREATE TABLE IF NOT EXISTS guild_disabled_categories (guildId TEXT, categoriesDisabled TEXT)").then(() => {
          sql.run("INSERT INTO guild_disabled_categories (guildId, categoriesDisabled) VALUES (?, ?)", [guild.id, 'none']);
        });
      });
      // Disaled commands
      sql.get(`SELECT * FROM guild_disabled_commands WHERE guildId ="${guild.id}"`).then(row => {
        if (!row) {
          sql.run("INSERT INTO guild_disabled_commands (guildId, commandsDisabled) VALUES (?, ?)", [guild.id, 'none']);
        }
      }).catch(() => {
        sql.run("CREATE TABLE IF NOT EXISTS guild_disabled_commands (guildId TEXT, commandsDisabled TEXT)").then(() => {
          sql.run("INSERT INTO guild_disabled_commands (guildId, commandsDisabled) VALUES (?, ?)", [guild.id, 'none']);
        });
      })
      // guild settings
      sql.get(`SELECT * FROM guild_moderation_settings WHERE guildId ="${guild.id}"`).then(row => {
        if (!row) {
          sql.run("INSERT INTO guild_moderation_settings (guildId, casenumber, mod_logs_enabled, mod_logs_channel, chat_logs_enabled, chat_logs_channel, mod_only_enabled, mod_roles) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [guild.id, 1, "enabled", "mod-logs", "chat-logs", "mod-logs", "disabled", "none-set"]);
        }
      }).catch(() => {
        sql.run("CREATE TABLE IF NOT EXISTS guild_moderation_settings (guildId TEXT, casenumber INTEGER, mod_logs_enabled TEXT, mod_logs_channel TEXT, chat_logs_enabled TEXT, chat_logs_channel TEXT, mod_only_enabled TEXT, mod_roles TEXT)").then(() => {
          sql.run("INSERT INTO guild_moderation_settings (guildId, casenumber, mod_logs_enabled, mod_logs_channel, chat_logs_enabled, chat_logs_channel, mod_only_enabled, mod_roles) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [guild.id, 1, "enabled", "mod-logs", "chat-logs", "mod-logs", "disabled", "none-set"]);
        });
      })
      sql.get(`SELECT * FROM guild_misc_settings WHERE guildId ="${guild.id}"`).then(row => {
        if (!row) {
          sql.run("INSERT INTO guild_misc_settings (guildId, custom_commands_enabled, profiles_enabled, leveling_enabled, gambling_enabled, mute_role, role_persist_enabled) VALUES (?, ?, ?, ?, ?, ?, ?)", [guild.id, "disabled", "disabled", "disabled", "disabled", "Muted", "disabled"]);
        }
      }).catch(() => {
        sql.run("CREATE TABLE IF NOT EXISTS guild_misc_settings (guildId TEXT, custom_commands_enabled TEXT, profiles_enabled TEXT, leveling_enabled TEXT, gambling_enabled TEXT, mute_role TEXT, role_persist_enabled TEXT)").then(() => {
          sql.run("INSERT INTO guild_misc_settings (guildId, custom_commands_enabled, profiles_enabled, leveling_enabled, gambling_enabled, mute_role, role_persist_enabled) VALUES (?, ?, ?, ?, ?, ?, ?)", [guild.id, "disabled", "disabled", "disabled", "disabled", "Muted", "disabled"]);
        });
      })
      sql.get(`SELECT * FROM guild_autorole_antijoin_settings WHERE guildId ="${guild.id}"`).then(row => {
        if (!row) {
          sql.run("INSERT INTO guild_autorole_antijoin_settings (guildId, auto_roles, auto_role_enabled, anti_join_enabled) VALUES (?, ?, ?, ?)", [guild.id, "no-roles-set", "disabled", "disabled"]);
        }
      }).catch(() => {
        sql.run("CREATE TABLE IF NOT EXISTS guild_autorole_antijoin_settings (guildId TEXT, auto_roles TEXT, auto_role_enabled TEXT, anti_join_enabled TEXT)").then(() => {
          sql.run("INSERT INTO guild_autorole_antijoin_settings (guildId, auto_roles, auto_role_enabled, anti_join_enabled) VALUES (?, ?, ?, ?)", [guild.id, "no-roles-set", "disabled", "disabled"]);
        });
      })
      // Guild welcome/leave messages
      sql.get(`SELECT * FROM guild_wl_system WHERE guildId ="${guild.id}"`).then(row => {
        if (!row) {
          sql.run("INSERT INTO guild_wl_system (guildId, wl_enabled, wl_channel, welcome_message, leave_message, wl_dm_enabled) VALUES (?, ?, ?, ?, ?, ?)", [guild.id, "disabled", "welcome-leaves", "Hello %user.mention%, welcome to %server.name% you're the %server.memberCount% user.", "%user.name% has left the guild, can you believe it?", "disabled"]);
        }
      }).catch(() => {
        sql.run("CREATE TABLE IF NOT EXISTS guild_wl_system (guildId TEXT, wl_enabled TEXT, wl_channel TEXT, welcome_message TEXT, leave_message TEXT, wl_dm_enabled TEXT)").then(() => {
          sql.run("INSERT INTO guild_wl_system (guildId, wl_enabled, wl_channel, welcome_message, leave_message, wl_dm_enabled) VALUES (?, ?, ?, ?, ?, ?)", [guild.id, "disabled", "welcome-leaves", "Hello %user.mention%, welcome to %server.name% you're the %server.memberCount% user.", "%user.name% has left the guild, can you believe it?", "disabled"]);
        });
      })
      // Guild automod settings
      sql.get(`SELECT * FROM guild_amod_settings WHERE guildId ="${guild.id}"`).then(row => {
        if (!row) {
          sql.run("INSERT INTO guild_amod_settings (guildId, automod_enabled, anti_invite_enabled, anti_weblink_enabled, anti_dup_char_enabled, anti_swear_enabled, anti_swear_words) VALUES (?, ?, ?, ?, ?, ?, ?)", [guild.id, "disabled", "disabled", "disabled", "disabled", "disabled", "no-words-to-filter"]);
        }
      }).catch(() => {
        sql.run("CREATE TABLE IF NOT EXISTS guild_amod_settings (guildId TEXT, automod_enabled TEXT, anti_invite_enabled TEXT, anti_weblink_enabled TEXT, anti_dup_char_enabled TEXT, anti_swear_enabled TEXT, anti_swear_words TEXT)").then(() => {
          sql.run("INSERT INTO guild_amod_settings (guildId, automod_enabled, anti_invite_enabled, anti_weblink_enabled, anti_dup_char_enabled, anti_swear_enabled, anti_swear_words) VALUES (?, ?, ?, ?, ?, ?, ?)", [guild.id, "disabled", "disabled", "disabled", "disabled", "disabled", "no-words-to-filter"]);
        });
      })
      // Server password
      sql.get(`SELECT * FROM guild_pass_settings WHERE guildId ="${guild.id}"`).then(row => {
        if (!row) {
          sql.run("INSERT INTO guild_pass_settings (guildId, guild_pass_enabled, guild_password, password_uses, password_role) VALUES (?, ?, ?, ?, ?)", [guild.id, 'disabled', 'no-password-set', 0, 'no-role-set']);
        }
      }).catch(() => {
        sql.run("CREATE TABLE IF NOT EXISTS guild_pass_settings (guildId TEXT, guild_pass_enabled TEXT, guild_password TEXT, password_uses TEXT, password_role TEXT)").then(() => {
          sql.run("INSERT INTO guild_pass_settings (guildId, guild_pass_enabled, guild_password, password_uses, password_role) VALUES (?, ?, ?, ?, ?)", [guild.id, 'disabled', 'no-password-set', 0, 'no-role-set']);
        });
      })
      try {
        console.log(`Someone added MrGoodBot to their discord! ${guild.name} Member count: ${guild.memberCount} owned by: ${guild.owner.user.username}!`)
        const owner = guild.owner.user;
        var setup_message = [
            "Thanks for adding me to your server. Just a few tips to get you started..",
            "```**1.** Justin's default prefix is `j!`.",
            "**2.** Commands will not work in direct messages.",
            "**3.** Set welcome leave messages with j!welcome-leave.",
            "**4.** Set logs channel with j!manage-logs.",
            "**5.** Set autorole with j!auto-role.",
            "**6.** Prefix can be changed with j!prefix [new prefix].",
            "**7.** Profile System can be enabled with j!manage-profiles.",
            "**8.** Automod can be enabled with j!auto-mod```"
        ]
        owner.send(setup_message);
      } catch (err) {
        console.log(err);
      }
};