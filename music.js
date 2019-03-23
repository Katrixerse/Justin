const Discord = require("discord.js");
const yt = require('ytdl-core');
const ytdlDiscord = require('ytdl-core-discord');
const request = require('node-superfetch');
const sql = require("sqlite");
const config = require("./assets/json/config.json");
const stations = require("./assets/json/radiostations.json");
sql.open("./assets/db/botsdb.sqlite");

const client = new Discord.Client({
    disabledEvents: ["CHANNEL_PINS_UPDATE", "GUILD_BAN_ADD", "GUILD_BAN_REMOVE", "RELATIONSHIP_ADD", "RELATIONSHIP_REMOVE", "TYPING_START", "GUILD_MEMBER_ADD", "GUILD_MEMBER_REMOVE", "GUILD_MEMBER_UPDATE", "MESSAGE_UPDATE", "MESSAGE_DELETE", "USER_NOTE_UPDATE", "PRESENCE_UPDATE"],
    disableEveryone: true,
    messageCacheMaxSize: 100,
    messageCacheLifetime: 200,
    messageSweepInterval: 220,
});

let dispatcher;
let dispatcher_radio;

if (Number(process.version.slice(1).split(".")[0]) < 8) {
    console.log("Node 8.0.0 or higher is required. Update Node on your system.");
}

let queue = {};
let skip = 0;

client.on('error', err => console.error('[ERROR]', err));

client.on('warn', err => console.warn('[WARNING]', err));

client.on('rateLimit', err => console.log('[RATELIMIT]', err));

client.on('voiceStateUpdate', (newMember, oldMember) => {
    let oldMemberChannel = newMember.voiceChannel;
    let newMemberChannel = oldMember.voiceChannel;
    if (oldMemberChannel === undefined && newMemberChannel !== undefined) {

    } else if (newMemberChannel === undefined) {
        if (oldMemberChannel.members.size == 1) {
            const voiceChannel = oldMemberChannel;
            if (!voiceChannel || voiceChannel.type !== 'voice') return;
            const GuildCheck = client.guilds.get(oldMemberChannel.guild.id)
            if (GuildCheck.voiceConnection === 'null') {
                try {
                    voiceChannel.leave()
                } catch (err) {
                    console.log(err.message)
                }
            }
        }
    }
})

process.on('unhandledRejection', (error) => {
    console.log('[FATAL] Possibly Unhandled Rejection: ' + error);
});

process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.log(`Uncaught Exception: ${errorMsg}`);
    process.exit(1);
});

client.on('disconnect', () => {
    console.warn('Disconnected!')
    process.exit(0);
})

client.on('reconnecting', () => console.warn('Reconnecting...'))

client.on('ready', () => {
    console.log('ready!');
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (!message.guild.me.hasPermission('VIEW_CHANNEL')) return;
    if (!message.guild.me.hasPermission('SEND_MESSAGES')) return;


    sql.get(`SELECT prefix FROM guild_prefix WHERE guildId ="${message.guild.id}"`).then(async (row) => {
        if (!row) return;

        const prefix = row.prefix
        if (row.prefix === undefined) return prefix = ">"
        if (message.content.indexOf(prefix) !== 0) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (command === "play") {
            const channel = message.member.voiceChannel;
            if (!channel || channel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
            if (channel && !channel.joinable) {
                return message.channel.send("Can't join your voice channel.");
            };
            const permissions = channel.permissionsFor(message.client.user);
            if (!permissions.has('CONNECT')) {
                return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
            }
            if (!permissions.has('SPEAK')) {
                return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
            }
            if (queue[message.guild.id] === undefined || queue[message.guild.id] === '') return message.channel.send(`Add some songs to the queue first with add`);
            if (message.guild.voiceConnection) return message.channel.send("Bot is aleady connected to a voice channel.")
            try {
                await channel.join()
            } catch (err) {
                console.error(`I could not join the voice channel: ${err.stack}`);
                queue[message.guild.id] = {};
                return message.channel.send(`I could not join the voice channel: ${err}`);
            }
            if (queue[message.guild.id].playing) return message.channel.send('Already Playing the queue.');
            queue[message.guild.id].playing = true;
            (async function play(song) {
                if (song === undefined) return message.channel.send('Queue is empty, disconnecting till more is queued.').then(() => {
                    queue[message.guild.id].playing = false;
                    try {
                        message.member.voiceChannel.leave();
                    } catch (err) {
                        console.log(err.message)
                    }
                });
                console.log(song.title + " in " + message.guild.name);
                message.channel.send(`Playing: **${song.title}** as requested by: **${song.requester}**`);
                dispatcher = message.guild.voiceConnection.playOpusStream(await ytdlDiscord(song.url, {
                    highWaterMark: 1<<25,
                    audioonly: true
                }), {
                    bitrate: 'auto',
                    passes: 6,
                    quality: 'highestaudio'
                });
                dispatcher.on('end', () => {
                    try {
                        play(queue[message.guild.id].songs.shift());
                    } catch (err) {
                        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                    }
                });
                dispatcher.on('error', (err) => {
                    return message.channel.send('error: ' + err).then(() => {
                        play(queue[message.guild.id].songs.shift());
                    });
                });
            })(queue[message.guild.id].songs.shift());
        }

        if (command === "add") {
            let query = args.join(' ');
            if (query < 1) return message.channel.send('You must include a query for what you want to play, add [songname/url]')
            const msg = await message.channel.send("Searching...")
            if (query.includes("youtube.com/watch")) {
                let url = query
                yt.getInfo(url, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
                    if (err) return message.channel.send('Invalid YouTube Link: ' + err);
                    if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                    queue[message.guild.id].songs.push({
                        url: url,
                        title: info.title,
                        requester: message.author.username
                    });
                    msg.edit(`Added **${info.title}** to the queue`);
                });
            } else {
                try {
                    const { body } = await request
                        .get('https://www.googleapis.com/youtube/v3/search')
                        .query({
                            type: 'video',
                            q: query,
                            maxResults: 5,
                            part: 'snippet',
                            //order: 'relevance',
                            //videoDuration: 'medium',
                            key: "Your key"
                        });
                    if (!body.items.length) return message.channel.send('No results found for ' + query + ".");
                    const output = `[1] - ${body.items[0].snippet.title}.\n[2] - ${body.items[1].snippet.title}.\n[3] - ${body.items[2].snippet.title}.\n[4] - ${body.items[3].snippet.title}.\n[5] - ${body.items[4].snippet.title}.\n# Type exit or none to cancel the command.`;
                    const helpembed = new Discord.RichEmbed()
                        .setColor(0x6B363E)
                        .addField('Multiple options found which one would you like to play?', "```" + output + "```")
                    msg.edit(helpembed)
                        .then(() => {
                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    time: 30000,
                                    errors: ['time'],
                                })
                                .then(async (resp) => {
                                    if (!resp) return;
                                    resp = resp.array()[0];
                                    if (resp.content === "1") {
                                        let url = `https://www.youtube.com/watch?v=${body.items[0].id.videoId}`
                                        yt.getInfo(url, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
                                            if (err) return message.channel.send('Invalid YouTube Link: ' + err);
                                            if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                                            queue[message.guild.id].songs.push({
                                                url: url,
                                                title: info.title,
                                                requester: message.author.username
                                            });
                                            const newembed = new Discord.RichEmbed()
                                                .setColor(0x6B363E)
                                                .setDescription(`Added **${info.title}** to the queue`)
                                            msg.edit(newembed);
                                        });
                                    } else if (resp.content === "2") {
                                        let url = `https://www.youtube.com/watch?v=${body.items[1].id.videoId}`
                                        yt.getInfo(url, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
                                            if (err) return message.channel.send('Invalid YouTube Link: ' + err);
                                            if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                                            queue[message.guild.id].songs.push({
                                                url: url,
                                                title: info.title,
                                                requester: message.author.username
                                            });
                                            const newembed = new Discord.RichEmbed()
                                                .setColor(0x6B363E)
                                                .setDescription(`Added **${info.title}** to the queue`)
                                            msg.edit(newembed);
                                        });
                                    } else if (resp.content === "3") {
                                        let url = `https://www.youtube.com/watch?v=${body.items[2].id.videoId}`
                                        yt.getInfo(url, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
                                            if (err) return message.channel.send('Invalid YouTube Link: ' + err);
                                            if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                                            queue[message.guild.id].songs.push({
                                                url: url,
                                                title: info.title,
                                                requester: message.author.username
                                            });
                                            const newembed = new Discord.RichEmbed()
                                                .setColor(0x6B363E)
                                                .setDescription(`Added **${info.title}** to the queue`)
                                            msg.edit(newembed);
                                        });
                                    } else if (resp.content === "4") {
                                        let url = `https://www.youtube.com/watch?v=${body.items[5].id.videoId}`
                                        yt.getInfo(url, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
                                            if (err) return message.channel.send('Invalid YouTube Link: ' + err);
                                            if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                                            queue[message.guild.id].songs.push({
                                                url: url,
                                                title: info.title,
                                                requester: message.author.username
                                            });
                                            const newembed = new Discord.RichEmbed()
                                                .setColor(0x6B363E)
                                                .setDescription(`Added **${info.title}** to the queue`)
                                            msg.edit(newembed);
                                        });
                                    } else if (resp.content === "5") {
                                        let url = `https://www.youtube.com/watch?v=${body.items[5].id.videoId}`
                                        yt.getInfo(url, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
                                            if (err) return message.channel.send('Invalid YouTube Link: ' + err);
                                            if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                                            queue[message.guild.id].songs.push({
                                                url: url,
                                                title: info.title,
                                                requester: message.author.username
                                            });
                                            const newembed = new Discord.RichEmbed()
                                                .setColor(0x6B363E)
                                                .setDescription(`Added **${info.title}** to the queue`)
                                            msg.edit(newembed);
                                        });
                                    } else if (resp.content === "none" || resp.content === "exit") {
                                        message.channel.send("Cancelled add command.")
                                    }
                                })
                                .catch((err) => {
                                    console.log("An error happened Error Details: " + err.stack)
                                    message.channel.send(`Didn't pick a option so command has been cancelled.`);
                                });
                        });
                } catch (err) {
                    return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                }
            }
        }

        if (command === "join") {
            return new Promise((resolve, reject) => {
                const voiceChannel = message.member.voiceChannel;
                if (voiceChannel && !voiceChannel.joinable) return message.channel.send("Can't join your voice channel.");
                if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
                const GuildCheck = client.guilds.get(message.guild.id)
                if (GuildCheck.voiceConnection === 'null') {
                    voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
                } else {
                    return message.channel.send('Make sure the bot isn\'t already in a another voice channel.')
                }
            });
        }

        if (command === "leave") {
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t leave your voice channel...');
            const GuildCheck = client.guilds.get(message.guild.id);
            if (!queue) return message.channel.send('There is nothing playing that I could stop for you.');
            if (GuildCheck.voiceConnection) {
                try {
                    if (queue[message.guild.id] === undefined || queue[message.guild.id] === {}) {
                        voiceChannel.leave();
                    } else {
                        queue[message.guild.id] = {};
                        dispatcher.end();
                    }
                } catch (err) {
                    return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                }
            } else {
                return message.channel.send('Make sure the bot is in a voice channel to leave.')
            }
        }

        if (command === "queue") {
            if (queue[message.guild.id] === undefined || queue[message.guild.id] === {}) return message.channel.send(`Add some songs to the queue first with add`);
            let tosend = [];
            queue[message.guild.id].songs.forEach((song, i) => {
                tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);
            });
            if (tosend.length <= 0) return message.channel.send(`**${message.guild.name}'s Music Queue:** Currently **${tosend.length}** queued.`);
            message.channel.send(`**${message.guild.name}'s Music Queue:** Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
        }

        if (command === "clearqueue") {
            if (queue === {}) return message.channel.send('Queue is empty, have no songs to remove.');
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t leave your voice channel...');
            queue[message.guild.id] = {};
            message.channel.send('Queue has been cleared, use >add to start playing music again.')
            voiceChannel.leave()
        }

        if (command === "pause") {
            const channel = message.member.voiceChannel;
            if (!channel || channel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
            if (queue[message.guild.id] === undefined || queue[message.guild.id] === {}) return message.channel.send(`Add some songs to the queue first with add`);
            if (dispatcher.paused) {
                message.channel.send('Music is already paused.')
            } else {
                message.channel.send('Music has been paused, use >resume to start playing music again.')
            }
        }

        if (command === "resume") {
            const channel = message.member.voiceChannel;
            if (!channel || channel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
            if (queue[message.guild.id] === undefined || queue[message.guild.id] === {}) return message.channel.send(`Add some songs to the queue first with add`);
            if (dispatcher.paused) {
                dispatcher.resume();
                message.channel.send('Music has been resumed.')
            } else {
                message.channel.send("Music is already playing!")
            }
        }

        if (command === "skip") {
            const channel = message.member.voiceChannel;
            if (!channel || channel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel to skip the song...');
            if (queue[message.guild.id] === undefined || queue[message.guild.id] === {}) return message.channel.send(`Add some songs to the queue first with add`);
            let dj = client.guilds.get(message.guild.id).roles.find(role => role.name == 'dj');
            if (message.member.roles.has(dj.id)) {
                message.channel.send('Current song has been skipped.')
                dispatcher.end();
            } else {
                message.channel.send(`Please use ${prefix}skip to vote to skip the song, needs 4 votes to pass.`)
                    .then(() => {
                        message.channel.awaitMessages(response => response.content === 'test', {
                                max: 4,
                                time: 450000,
                                errors: ['time'],
                            })
                            .then((collected) => {
                                if (collected.content === 'skip') {
                                    skip += 1;
                                    message.channel.send(`You have voted to skip the current song, you need 4 votes to skip, currently have: ${skip}/4`)
                                }
                            })
                            .catch(() => {
                                message.channel.send('There was no collected message that passed the filter within the time limit!');
                            });
                    })
                if (skip >= 4) {
                    message.channel.send('Current song has been skipped.')
                    dispatcher.end();
                    skip = 0;
                }
            }
        }
        if (command === "volume") {
            const volumetoset = parseInt(args.join(''))
            if (volumetoset > 200 || volumetoset < 0) return message.channel.send('Volume out of range!').then((response) => {
                response.delete(5000);
            });
            if (isNaN(volumetoset)) return message.channel.send("Need to provide a valid number.")
            dispatcher.setVolume(volumetoset / 100);
            message.channel.send(`Volume now set too: ${volumetoset}%`);
        }
        if (command === "radio") {
            const channel = message.member.voiceChannel;
            if (!channel || channel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
            if (channel && !channel.joinable) {
                return message.channel.send("Can't join your voice channel.");
            };
            const permissions = channel.permissionsFor(message.client.user);
            if (!permissions.has('CONNECT')) {
                return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
            }
            if (!permissions.has('SPEAK')) {
                return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
            }
            if (message.guild.voiceConnection) return message.channel.send("Bot is aleady connected to a voice channel.")
            const station = stations[args];
            if (!station) {
                return message.channel.send("No such station found");
            }
            if (queue[message.guild.id] !== undefined || queue[message.guild.id] === '') return message.channel.send(`Please stop any other music before trying to play the radio.`);
            try {
                await channel.join()
            } catch (err) {
                console.error(`I could not join the voice channel: ${error.stack}`);
                return message.channel.send(`I could not join the voice channel: ${error}`);
            }
            dispatcher_radio = message.guild.voiceConnection.playStream(station.url, {
                volume: 0.25
            }), {
                bitrate: 'auto',
                passes: 6,
                quality: 'highestaudio'
            };
            dispatcher_radio.on('end', () => {
                try {
                    message.member.voiceChannel.leave();
                    return message.channel.send('Radio has stopped playing.');
                } catch (err) {
                    console.log(err.message)
                }
            });
            dispatcher_radio.on('error', (err) => {
                try {
                    message.member.voiceChannel.leave();
                    console.log(err.stack)
                    return message.channel.send('error: ' + err);
                } catch (err) {
                    console.log(err.message)
                }
            });
            message.channel.send(`Now playing ${station.name}, please use ${prefix}stop-radio or ${prefix}leave to stop the radio.`)
        }
        if (command === 'stop-radio') {
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t leave your voice channel...');
            const GuildCheck = client.guilds.get(message.guild.id)
            if (GuildCheck.voiceConnection) {
                try {
                    dispatcher_radio.end();
                } catch (err) {
                    return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                }
            } else {
                return message.channel.send('Make sure the bot is in a voice channel to leave.')
            }
        }
        if (command === 'radio-stations') {
            let reply = "__**Radio stations:**__";
            for (station in stations) {
                const s = stations[station];

                if (!s || !s.name || !s.url) {
                    continue;
                }
                reply += `\n\t**${station}** - ${s.name}`;
            }
            message.channel.send(reply);
        }
        if (command === 'mexec') {
            const {
                exec
            } = require('child_process');
            if (message.author.id !== "130515926117253122") return message.channel.send("Only bot owner can use this command")

            const code = args.join(' ');
            if (!code) return message.channel.send('You provided no input are you stupid?');
            exec(code, (error, stdout, stderr) => {
                const input = `\`\`\`Bash\n${code}\n\`\`\``;
                if (error) {
                    let output = `\`\`\`Bash\n${error}\n\`\`\``;
                    message.channel.send(input, {
                        split: true
                    });
                    return message.channel.send(output, {
                        split: true
                    });
                } else {
                    const output = stderr || stdout;
                    const output2 = `\`\`\`Bash\n${output}\n\`\`\``;
                    message.channel.send(output2, {
                        split: true
                    });
                }
            });
        }
    })
});

client.login(config.token);