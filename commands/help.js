const Discord = require("discord.js");
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
var maincommands = [
  "help - Bot will dm you a link with all of the commands.",
  "ping - Bot will respond with pong and time it took.",
  "embed [text] - Will send a embed with [text].",
  "stats - Will get all the bots information. ",
  "reminder [minutes] [text] - Will send you a reminder for [text] in [time]. ",
  "invite - Will send you a invite for the bot.",
  "server-info - Will get the current servers info.",
  "server-emojis - Will get the servers emojis.",
  "server-roles - Will get the servers roles.",
  "credits - Will tell you who created the bot and the contributers.",
  "get-channels - Bot will fetch the text/voice channel count.",
  "membercount - Bot will fetch the member/bot count.",
  "prefix - Will change the bots prefix for the guild.",
  "reset-prefix - Allows you to reset the prefix if your forgot it.",
  "suggestion - Can send a suggestion/bug to me.",
  "support - Sends you the support link for the discord server. ",
  "uptime - Gets the bots uptime.",
  "whois @Someone - Gets the users info.",
  "afk [reason] - Sets you afk and if your tagged will say you are."
]
var moderationcommands = [
  "ban @Someone [reason] - Will ban that user from the server.",
  "unban @Someone [reason] - Will unban that user from the server.",
  "softban [ID] [reason] - Will ban then unban that user from the server.",
  "hackban [ID] [reason] - Will ban that ID/user from the server.",
  "mute @Someone [minutes] [reason] - Will mute that user from the server for the time. ",
  "unmute @Someone [reason] - Will unmute that user from the server.",
  "purge [amount/@Someone] [reason/amount] - Will purge messages from the server/user. ",
  "clean [amount] - Will delete the bots messages.",
  "antiraid [minutes] [reason] - Will disable the default role to send messages.",
  "role-user @User [rolename] - Allows you to give/take the role you specified from a user.",
  "role-all [rolename] - Will give all users the role you specified.",
  "rrole-all [rolename] - Will take the role from all users that you specified.",
  "auto-mod - Will Turn on the bots automoderation.",
  "auto-role [rolename] - Will give the role specified when a user joins.",
  "manage-logs - Will give options to edit logs settings.",
  "[NA] modonly - Will make commands work for mods only (mods/mods+ need at least kick perms to work).",
  "welcome-leave - Will give you all the options to control the wl system",
  "poll [text] - Will start a poll for your members too vote in.",
  "nick [text] - Will change the users nickname.",
  "warn - @Someone [reason] - Will warn the user wth [reason].",
  "warings @Someone - Will show the warnings the current user has.",
  "clearwarns @Someone - Will remove all the current warnings a user has."
]
var moderationcommands2 = [
  "punishments @Someone - View a users punishments like warn, kick, ban, mute.",
  "remove-punishment [Option] - Can remove a users punishment by case number or all of them.",
  "serverpass [enable/disable] - enable/disable server2fa, when users join they have to enter a random code in dms.",
  "serverpass other options: [role] (the role they will get when verified)",
  "role-persist [Option] - So if someone leaves with roles and they rejoin they will automatically get them back.",
  "custom-commands - Allows you to make custom commands for your guild.",
  "manage-commands - Allows you to enable/disable commands in your guild.",
  "manage-category - Allows you to enable/disable command categories in your guild."
]
var funcommands = [
  "slap @Someone - Will send a image of you slapping that user.",
  "shit @Someone - Will send a image of you stepping on that user.",
  "buttslap @Someone - Will send a image buttslapping that user. [NSFW]",
  "rip @Someone - Will send a image paying respects to that user.",
  "trigger @Someone - Will send a image of that user being triggered.",
  "brazzers @Someone - Will send a image with the brazzers logo on that user.",
  "power @Someone - Will send a image of heman with avatar over users head.",
  "beautiful @Someone - Will send a image of that user in a picture frame.",
  "crush @Someone - Will send a image having a crush on that user",
  "delete @Someone - Will send a image deleting that user.",
  "jail @Someone - Will put the user behind bars.",
  "thuglife @Someone - Will put thuglife over a users avatar.",
  "rainbow @Someone - Will put a rainbow over a users avatar.",
  "approved @Someone - Will put approved over a users avatar.",
  "rejected @Someone - Will put rejected over a users avatar.",
  "8ball [question] - Bot will respond with a random 8ball response.",
  "coinflip - Bot will respond with heads or tails.",
  "cat - Bot will send a random cat photo.",
  "roll [maxnumber] - Bot will roll the dice between 1 and max number",
  "achievement [text] - Will send you a mincraft achievement.",
  "avatar @Someone - Will get the users avatar.",
  "booksearch [query] - Will perform a booksearch with the [query] you want.",
  "currency [currency1] [currency2] [amount] - Will convert an amount of money to another currency.",
  "giphy [query] - Will send a gif based off of the text you provided.",
  "google [query] - Will do a google search and send the top 3 results."
]
var funcommands2 = [
  "reverse [text] - Will reverse the text you provided.",
  "roblox [query] - Will search for a user on roblox.",
  "rr - Will play russian roulette.",
  "say [text] - Make the bot say [text].",
  "sexyrate - Bot will rate your sexyness from 1 to 100.",
  "ship [text] [text] - Will ship you/item with another user/item.",
  "slots - Play a game of slots.",
  "temp [celsius/fahrenheit] [celsius/fahrenheit] [number] - Will convert a number from celsius fahrenheit.",
  "textflip [text] - Flips text upside down.",
  "today - Will say something that happened today in history.",
  "urban [word] - Will get the definition for a word.",
  "weather [location] - Will get the weather for a location.",
  "weeb - Will send a random anime image.",
  "wikipedia [query] - Will search on wikipedia for [query].",
  "wur - Play a game of would you rather.",
  "youtube [query] - Will do a youtube video search for [query].",
  "fish - Go fishing.",
  "shortenurl - Will reply with a shortned url of the one provided.",
  "choose [choice1] [choice2] - Bot chooses between 2 options you provide.",
  "nytimes [query] - Will get the most recent news article about [query].",
  "meme - Bot will send you a random trending meme from r/dankmemes.",
  "showerthoughts - Bot will send you a random post from r/showerthoughts"
]
var funcommands3 = [
  "aww - Bot will send a random photo that makes you go aww.",
  "character-count - Count the characters you wanted to.",
  "lsn - Learn something new.",
  "tattoo @Someone - Makes users avatar the ultimate tattoo.",
  "drake @Someone - Drake with pick user over you.",
  "look @Someone - Look what i have on this piece of paper.",
  "continued @Someone - Will put to be continued over a users avatar.",
  "who-would-win @Somone - Asks who would win between you and @Someone.",
  "opinion [text] - Bot will give you thumbs up or thumbs down.",
  "translate [langfrom] [langto] [text] - Will translate text for you."
]
var roleplaycommands = [
  "hug @Someone - Will send a image hugging that user.",
  "kiss @Someone - Will send a image kissing that user.",
  "marry @Someone - Will send a image marrying that user.",
  "divorce @Someone - Will send a image divorcing that user.",
  "high-five @Someone - Will send a image high-fiving that user.",
  "cuddle @Someone - Will send a image cuddling that user.",
  "fist-bump @Someone - Will send a image fist-bumping that user.",
  "poke @Someone - Will send a image poking that user.",
  "pat @Someone - Will send a image patting that user.",
  "punch @Someone - Will send a image punching that user.",
  "hold-hands @Someone - Will send a image holding that users hand.",
  "tackle @Someone - Will send a image tackle that user.",
  "drop-kick @Someone - Will send a image drop kicking that user.",
  "bite @Someone - Will send a image bitting that user.",
  "stare @Someone - WIll send a image staring at that user.",
  "blush @Somone - Will send a image of that user blushing.",
  "wave @Someone - Will send a image of you waving towards that user."
]
var nsfwcommands = [
  "Warning: All these commands require a nsfw enabled channel and cant be used anywhere else.\n",
  "rule34 [query] - Will send a nsfw image based on the [query].",
  "ass - Will send a random nsfw image with ass.",
  "tits - Will send a random nsfw image with tits.",
  "hentai - Sends a random hentai picture",
  "porngif - Sends a random nsfw gif.",
  "4k - Sends a random highres nsfw picture.",
  "amateur - Sends a random amateur picture.",
  "cosplay - Sends a random nsfw cosplay picture.",
  "milf - Sends a random nsfw milf pciture.",
  "dick - Sends a random nsfw with dick.",
  "pussy - Sends a random nsfw image with pussy.",
  "uniform - Sends a random nsfw image with uniform.",
  "snapchat - Sends a random nsfw snapchat image."
]
var levelcommands = [
  "profile @Someone - Get someones profile.",
  "balance @Somone - Will show the users current bank and cash balance.",
  "deposit [amount] - Will deposit [amount] into your bank.",
  "withdraw [amount] - Will withdraw [amount] from your bank. [5% fee]",
  "transfer @Someone [amount] - Allows you to transfer money to another user.",
  "leaderboard [cash/level] - Displays the top 10 in the guild.",
  "25 [betamount] - Bet on the dice if it rolls above 25 win x1.25 of your bet.",
  "50 [betamount] - Bet on the dice if it rolls above 50 win x1.50 of your bet.",
  "75 [betamount] - Bet on the dice if it rolls above 75 win x1.75 of your bet.",
  "99 [betamount] - Bet on the dice if it rolls above 99 win x2.00 of your bet.",
  "roulette [odd/even] [betamount] - Bet on roulette if you win get x1.25 your bet.",
  "rob @Someone - Can try to rob this user for up too 5,000 but dont get caught.",
  "flipcoin [bet] [heads/tails] - Just like coinflip but get to bet money on it.",
  "bot-fight [bet] - Fight other bots with your bot everytime you win get 1% chance increase.",
  "\n",
  "These commands require MANAGE_GUILD",
  "givemoney @Someone [amount] - Allows you to give money to a user.",
  "takemoney @Someone [amount] - Allows you to take money from that user.",
  "givexp @Someone [amount] - Allows you to give money to a user.",
  "takexp @Someone [amount] - Allows you to give money to a user.",
  "profilesystem - Allows you to enable/disable leveling/cash in your server.",
  "edit-rank [text] - Changes the users rank under there name on their profile."
]
var musiccommands = [
  "add [query/link] - Adds music to the queue.",
  "play - Will play the music in the queue.",
  "skip - Will skip the current song.",
  "queue - Will say the current queue.",
  "clearqueue - Will remove all the current songs in the queue",
  "pause - Will pause the current music.",
  "resume - Will resume the current music.",
  "join - Will join the voice channel."
]
exports.run = (client, message, args) => {
  if (args[0]) {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      sql.get(`SELECT prefix FROM guild_prefix WHERE guildId ="${message.guild.id}"`).then(row => {
      message.channel.send(`~~~ Command: ${command.help.name} ~~~ \nDescription: ${command.help.description}\nUsage: ${row.prefix}${command.help.usage}`, {
        code: 'asciidoc'
      });
    })
    }
  } else {
    const embed = new Discord.RichEmbed()
      .setColor(0x6B363E)
      .setTitle("Main commands.")
      .setDescription(maincommands)


    const embed2 = new Discord.RichEmbed()
      .setColor(0x6B363E)
      .setTitle("Moderation commands.")
      .setDescription(moderationcommands)

    const embed3 = new Discord.RichEmbed()
      .setColor(0x6B363E)
      .setTitle("Moderation commands page 2.")
      .setDescription(moderationcommands2)


    const embed4 = new Discord.RichEmbed()
      .setColor(0x6B363E)
      .setTitle("Fun commands.")
      .setDescription(funcommands)


    const embed5 = new Discord.RichEmbed()
      .setColor(0x6B363E)
      .setTitle("Fun commands page 2.")
      .setDescription(funcommands2)

    const embed6 = new Discord.RichEmbed()
      .setColor(0x6B363E)
      .setTitle("Fun commands page 3.")
      .setDescription(funcommands3)

    const embed7 = new Discord.RichEmbed()
      .setColor(0x6B363E)
      .setTitle("Roleplay commands.")
      .setDescription(roleplaycommands)

    const embed8 = new Discord.RichEmbed()
      .setColor(0x6B363E)
      .setTitle("NSFW commands.")
      .setDescription(nsfwcommands)

    const embed9 = new Discord.RichEmbed()
      .setColor(0x6B363E)
      .setTitle("Level/Gamble commands.")
      .setDescription(levelcommands)

    const embed10 = new Discord.RichEmbed()
      .setColor(0x6B363E)
      .setTitle("Music (Beta) commands.")
      .setDescription(musiccommands)

    const helpembed = new Discord.RichEmbed()
      .setColor(0x6B363E)
      .addField('Which help page would you like to see?', '\n[1] - Main commands\n[2] - Moderation commands\n[3] - Moderation commands page 2\n[4] - Fun commands\n[5] - Fun commands page 2\n[6] - Fun commands page 3\n[7] - Roleplay commands\n[8] - NSFW commands\n[9] - Level/gamble command\n[10] - Music (Beta)\n# Type the number to see the page.\n# Type exit to leave this menu.')
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
              message.author.send(embed).then(() => message.channel.send("Commands have been sent to you in dms.")).catch(() => message.channel.send("Failed to send you the commands list in dms, may have dms turned off."));
            } else if (resp.content === "2") {
              message.author.send(embed2).then(() => message.channel.send("Commands have been sent to you in dms.")).catch(() => message.channel.send("Failed to send you the commands list in dms, may have dms turned off."));
            } else if (resp.content === "3") {
              message.author.send(embed3).then(() => message.channel.send("Commands have been sent to you in dms.")).catch(() => message.channel.send("Failed to send you the commands list in dms, may have dms turned off."));
            } else if (resp.content === "4") {
              message.author.send(embed4).then(() => message.channel.send("Commands have been sent to you in dms.")).catch(() => message.channel.send("Failed to send you the commands list in dms, may have dms turned off."));
            } else if (resp.content === "5") {
              message.author.send(embed5).then(() => message.channel.send("Commands have been sent to you in dms.")).catch(() => message.channel.send("Failed to send you the commands list in dms, may have dms turned off."));
            } else if (resp.content === "6") {
              message.author.send(embed6).then(() => message.channel.send("Commands have been sent to you in dms.")).catch(() => message.channel.send("Failed to send you the commands list in dms, may have dms turned off."));
            } else if (resp.content === "7") {
              message.author.send(embed7).then(() => message.channel.send("Commands have been sent to you in dms.")).catch(() => message.channel.send("Failed to send you the commands list in dms, may have dms turned off."));
            } else if (resp.content === "8") {
              message.author.send(embed8).then(() => message.channel.send("Commands have been sent to you in dms.")).catch(() => message.channel.send("Failed to send you the commands list in dms, may have dms turned off."));
            } else if (resp.content === "9") {
              message.author.send(embed9).then(() => message.channel.send("Commands have been sent to you in dms.")).catch(() => message.channel.send("Failed to send you the commands list in dms, may have dms turned off."));
            } else if (resp.content === "10") {
              message.author.send(embed10).then(() => message.channel.send("Commands have been sent to you in dms.")).catch(() => message.channel.send("Failed to send you the commands list in dms, may have dms turned off."));
            } else if (resp.content === "exit") {
              message.channel.send("Cancelled help command.")
            } else {}
          })
          .catch((err) => {
            if (err.message === undefined) {
              message.channel.send('You provided no input in the time limit, please try again.')
            } else {
              console.log(err)
              return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
            }
          });
      })
  }
}

exports.conf = {
  guildOnly: false,
  aliases: ['h', 'halp'],
  commandCategory: 'misc'
};

exports.help = {
  name: 'help',
  description: 'Displays all the available commands for your permission level.',
  usage: 'help [command]'
};