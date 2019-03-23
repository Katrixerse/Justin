const Discord = require('discord.js');
const client = new Discord.Client({
  disabledEvents: ["CHANNEL_PINS_UPDATE", "RELATIONSHIP_ADD", "RELATIONSHIP_REMOVE", "TYPING_START"],
  disableEveryone: true,
  messageCacheMaxSize: 150,
  messageCacheLifetime: 240,
  messageSweepInterval: 300,
});

const fs = require('fs');
const config = require('./assets/json/config.json');

const sql = require('sqlite');
sql.open("./assets/db/botsdb.sqlite");
const moment = require('moment');
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const errorDirnameRegex = new RegExp(`${__dirname}/`, "g");

// require mainfuncs
const mainfuncs = require('./handlers/main.js');

const talkedRecently = new Set();

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

fs.readdir('./events/', (err, files) => {
  if (err) console.error(err);
  files = files.filter(f => f.endsWith('.js'));
  files.forEach(f => {
    const event = require(`./events/${f}`);
    log(`Loading event: ${f}.`);
    client.on(f.split('.')[0], event.bind(null, client));
    delete require.cache[require.resolve(`./events/${f}`)];
  });
});

fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    const props = require(`./commands/${f}`);
    log(`Loading Command: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.on('message', (message) => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  sql.get(`SELECT gz.automod_enabled, gz.anti_invite_enabled, gz.anti_weblink_enabled, gz.anti_dup_char_enabled, gz.anti_swear_enabled, gz.anti_swear_words, gy.prefix, gb.mod_logs_enabled, gb.mod_logs_channel, gb.mod_roles, gms.custom_commands_enabled FROM guild_amod_settings as gz left join guild_prefix as gy on gy.guildId = gz.guildId left join guild_moderation_settings as gb on gb.guildId = gz.guildId left join guild_misc_settings as gms on gms.guildId = gz.guildIdWHERE gz.guildId ="${message.guild.id}"`).then(row => {
    if (!row1) return;
    const prefix = row1.prefix

    if (message.content.startsWith("<@" + client.user.id + ">") || message.content.startsWith("<@!" + client.user.id + ">")) {
      return message.reply("Prefix for this guild is `" + row1.prefix + "`.");
    }

    if (message.content === "reset-prefix") {
      mainfuncs.prefix_reset(message, args)
    }

    if (message.content.startsWith(prefix) && row1.custom_commands_enabled === 'enabled' && client.commands.has(message.content) === false && client.aliases.has(message.content) === false) {
      mainfuncs.custom_commands(message)
    }
    // other functions
    if (!message.content.startsWith(row.prefix)) {
      mainfuncs.anti_dup_char(message, row);
      if (invitecheck.some(word => message.content.toLowerCase().includes(word))) {
        mainfuncs.anti_invite(message, row);
      }
      if (weblinkcheck.some(word2 => message.content.toLowerCase().includes(word2))) {
        mainfuncs.anti_web_link(message, row);
      }
      if (a.some(word2 => message.content.toLowerCase().includes(word2))) {
        var newStr = row.anti_swear_words.replace(/,/g, ' ');
        var a = newStr.split(" ");
        mainfuncs.anti_swear(message, a);
      }
      mainfuncs.profile_system(message);
    }
  })
})

client.on("guildMemberAdd", (member) => {
  if (!member.guild.me.hasPermission('SEND_MESSAGES')) return;
  if (!member.guild.me.hasPermission('VIEW_CHANNEL')) return;
  sql.get(`SELECT auto_roles, auto_role_enabled, anti_join_enabled FROM guild_autorole_antijoin_settings WHERE guildId ="${member.guild.id}"`).then(row => {
    if (!row) return;
    if (row.anti_join_enabled === "enabled") {
      member.user.send("Anti-join has been enabled in " + member.guild.name + " you have been kicked automatically.")
      member.guild.member(member.user.id).kick().catch(console.error);
    }
    if (row.auto_role_enabled === 'enabled') {
      if (!member.guild.me.hasPermission('MANAGE_ROLES')) return;
      var a = row.auto_roles.split(" ");
      a.forEach(u => {
        let subscriberRole = client.guilds.get(member.guild.id).roles.find(n => n.name === u);
        if (!subscriberRole) return;
        if (subscriberRole.position >= member.guild.member(client.user).highestRole.position) return;
        member.guild.member(member.user.id).addRole(subscriberRole).catch(console.error);
      })
    }
  })
});

client.on("disconnect", () => console.warn("Bot is disconnecting..."))
  .on("reconnecting", () => console.log("Bot reconnecting..."))
  .on("error", err => console.error(err.message))
  .on("warn", info => console.warn(info));

process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(errorDirnameRegex, "./");
  console.error(`Uncaught Exception: ${errorMsg}`);
  process.exit(1);
});

process.on("unhandledRejection", console.error);

client.login(config.token)