const Discord = require("discord.js");
const yt = require('ytdl-core');
const ytdlDiscord = require('ytdl-core-discord');
const request = require('node-superfetch');
const rd = require('randomcolor')();
const stations = require("../jsons/radiostations.json");

let dispatcher;
let dispatcher_radio;
let queue = {};

module.exports = {
    play: (message) => {
        if (!message.guild.me.hasPermission("CONNECT")) return message.channel.send(`I need the CONNECT permission to execute this command...`);
        if (!message.guild.me.hasPermission("SPEAK")) return message.channel.send(`I need the SPEAK permission to execute this command...`);
        let channel = message.member.voiceChannel;
        if (!channel || channel.type !== "voice") return message.channel.send(`I couldn't find your voice channel.`);
        if (queue[message.guild.id] === undefined) return message.channel.send(`There are no songs to play, you can add some by using add.`);
        if (!message.guild.voiceConnection) {
            channel.join();
        }
        if (queue[message.guild.id].playing) return message.channel.send(`I am already playing the queue, use leave to stop playing.`);
        queue[message.guild.id].playing = true;
        (async function play(song) {
            if (song === undefined) return message.channel.send('Queue is empty, disconnecting till more is queued.').then(() => {
                queue[message.guild.id].playing = false;
                message.member.voiceChannel.leave();
            });
            message.channel.send(`Playing: **${song.title}** as requested by: **${song.requestedBy}**`);
            dispatcher = message.guild.voiceConnection.playOpusStream(await ytdlDiscord(song.url, {
                highWaterMark: 1<<25,
                audioonly: true
            }), {
                bitrate: 'auto',
                passes: 6,
                quality: 'highestaudio'
            });
            dispatcher.on('end', () => {
                play(queue[message.guild.id].songs.shift());
            });
            dispatcher.on('error', (err) => {
                return message.channel.send('error: ' + err).then(() => {
                    play(queue[message.guild.id].songs.shift());
                });
            });
        })(queue[message.guild.id].songs.shift());
    },
    add: async (message, args) => {
        let query = args.join(' ');
        if (query < 1) return message.channel.send('You must include a query for what you want to play, add [songname/url]');
        const msg = await message.channel.send("Searching...");
        if (query.includes("youtube.com/watch")) {
            let url = query;
            yt.getInfo(url, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
                if (err) return message.channel.send('Invalid YouTube Link: ' + err);
                if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                queue[message.guild.id].songs.push({
                    url: url,
                    title: info.title,
                    requestedBy: message.author.username
                });
                msg.edit(`Added **${info.title}** to the queue`);
            });
        } else {
            try {
                const {
                    body
                } = await request
                    .get('https://www.googleapis.com/youtube/v3/search')
                    .query({
                        type: 'video',
                        q: query,
                        maxResults: 5,
                        part: 'snippet',
                        //order: 'relevance',
                        //videoDuration: 'medium',
                        key: "Your api key"
                    });
                if (!body.items.length) return message.channel.send('No results found for ' + query + ".");
                const output = `[1] - ${body.items[0].snippet.title}.\n[2] - ${body.items[1].snippet.title}.\n[3] - ${body.items[2].snippet.title}.\n[4] - ${body.items[3].snippet.title}.\n[5] - ${body.items[4].snippet.title}.\n# Type exit or none to cancel the command.`;
                const helpembed = new Discord.RichEmbed()
                    .setColor(rd)
                    .addField('Multiple options found which one would you like to play?', "```" + output + "```");
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
                                    let url = `https://www.youtube.com/watch?v=${body.items[0].id.videoId}`;
                                    yt.getInfo(url, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
                                        if (err) return message.channel.send('Invalid YouTube Link: ' + err);
                                        if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                                        queue[message.guild.id].songs.push({
                                            url: url,
                                            title: info.title,
                                            requestedBy: message.author.username
                                        });
                                        const newembed = new Discord.RichEmbed()
                                            .setColor(rd)
                                            .setDescription(`Added **${info.title}** to the queue`);
                                        msg.edit(newembed);
                                    });
                                } else if (resp.content === "2") {
                                    let url = `https://www.youtube.com/watch?v=${body.items[1].id.videoId}`;
                                    yt.getInfo(url, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
                                        if (err) return message.channel.send('Invalid YouTube Link: ' + err);
                                        if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                                        queue[message.guild.id].songs.push({
                                            url: url,
                                            title: info.title,
                                            requestedBy: message.author.username
                                        });
                                        const newembed = new Discord.RichEmbed()
                                            .setColor(0x6B363E)
                                            .setDescription(`Added **${info.title}** to the queue`);
                                        msg.edit(newembed);
                                    });
                                } else if (resp.content === "3") {
                                    let url = `https://www.youtube.com/watch?v=${body.items[2].id.videoId}`;
                                    yt.getInfo(url, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
                                        if (err) return message.channel.send('Invalid YouTube Link: ' + err);
                                        if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                                        queue[message.guild.id].songs.push({
                                            url: url,
                                            title: info.title,
                                            requestedBy: message.author.username
                                        });
                                        const newembed = new Discord.RichEmbed()
                                            .setColor(rd)
                                            .setDescription(`Added **${info.title}** to the queue`);
                                        msg.edit(newembed);
                                    });
                                } else if (resp.content === "4") {
                                    let url = `https://www.youtube.com/watch?v=${body.items[5].id.videoId}`;
                                    yt.getInfo(url, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
                                        if (err) return message.channel.send('Invalid YouTube Link: ' + err);
                                        if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                                        queue[message.guild.id].songs.push({
                                            url: url,
                                            title: info.title,
                                            requestedBy: message.author.username
                                        });
                                        const newembed = new Discord.RichEmbed()
                                            .setColor(rd)
                                            .setDescription(`Added **${info.title}** to the queue`);
                                        msg.edit(newembed);
                                    });
                                } else if (resp.content === "5") {
                                    let url = `https://www.youtube.com/watch?v=${body.items[5].id.videoId}`;
                                    yt.getInfo(url, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
                                        if (err) return message.channel.send('Invalid YouTube Link: ' + err);
                                        if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                                        queue[message.guild.id].songs.push({
                                            url: url,
                                            title: info.title,
                                            requestedBy: message.author.username
                                        });
                                        const newembed = new Discord.RichEmbed()
                                            .setColor(rd)
                                            .setDescription(`Added **${info.title}** to the queue`);
                                        msg.edit(newembed);
                                    });
                                } else if (resp.content === "none" || resp.content === "exit") {
                                    message.channel.send("Cancelled add command.");
                                }
                            })
                            .catch((err) => {
                                console.log("An error happened Error Details: " + err.stack);
                                message.channel.send(`Didn't pick a option so command has been cancelled.`);
                            });
                    });
            } catch (err) {
                return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
            }
        }
    },
    queue: (message) => {
        if (queue[message.guild.id] === undefined || queue[message.guild.id] == {}) return message.channel.send(`The queue is empty, no songs to display!`);
        let send1 = [];
        queue[message.guild.id].songs.forEach((song, i) => {
            send1.push(`${i + 1}. ${song.title}, requested by ${song.requestedBy}`);
        });
        message.channel.send(`${message.guild.name}'s Music Queue:\` Currently ${send1.length} queued.\``);
    },
    clearqueue: (message) => {
        if (queue === {}) return send('Queue is empty, there are no songs to remove.');
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t find your voice channel...');
        queue[message.guild.id].songs == [];
        message.channel.send('Queue has been cleared!');
        voiceChannel.leave();
    },
    leave: (message, bot) => {
        const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t leave your voice channel...');
            const GuildCheck = bot.guilds.get(message.guild.id);
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
                return message.channel.send('Make sure the bot is in a voice channel to leave.');
            }
    },
    skip: (message, bot) => {
        const channel = message.member.voiceChannel;
        if (!channel || channel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel to skip the song...');
        if (queue[message.guild.id] === undefined || queue[message.guild.id] === {}) return message.channel.send(`Add some songs to the queue first with add`);
        let dj = bot.guilds.get(message.guild.id).roles.find(role => role.name == 'dj');
        if (dj && message.member.roles.has(dj.id)) {
            message.channel.send('Current song has been skipped.');
            dispatcher.end();
        } else {
            message.channel.send('Current song has been skipped.');
            dispatcher.end();
        }
    },
    pause: (message) => {
        dispatcher.pause();
        message.channel.send('Music has been paused, use >resume to start playing music again.');
    },
    resume: (message) => {
        dispatcher.resume();
        message.channel.send('Music has been resumed, if paused.');
    },
    volume: (message, args) => {
        const volumetoset = parseInt(args.join(""));
        if (volumetoset > 200 || volumetoset < 0) return message.channel.send('Volume out of range!').then((response) => {
            response.delete(5000);
        });
        if (isNaN(volumetoset)) return message.channel.send("Not a valid number to set volume to!");
        dispatcher.setVolume(volumetoset / 100);
        send(`Volume now set to: ${volumetoset}%`);
    },
    radio: async (message, args) => {
        const channel = message.member.voiceChannel;
        if (!channel || channel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
        if (channel && !channel.joinable) {
            return message.channel.send("Can't join your voice channel.");
        }
        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) {
            return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
        }
        if (!permissions.has('SPEAK')) {
            return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
        }
        if (message.guild.voiceConnection) return message.channel.send("Bot is aleady connected to a voice channel.");
        const station = stations[args];
        if (!station) {
            return message.channel.send("No such station found");
        }
        if (queue[message.guild.id] !== undefined || queue[message.guild.id] === '') return message.channel.send(`Please stop any other music before trying to play the radio.`);
        try {
            await channel.join();
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
                console.log(err.message);
            }
        });
        dispatcher_radio.on('error', (err) => {
            try {
                message.member.voiceChannel.leave();
                console.log(err.stack);
                return message.channel.send('error: ' + err);
            } catch (e) {
                console.log(e.message);
            }
        });
        message.channel.send(`Now playing ${station.name}, please use [stop-radio or [leave to stop the radio.`);
    },
    radio_stations: () => {
        let reply = "__**Radio stations:**__";
        for (var station in stations) {
            const s = stations[station];

            if (!s || !s.name || !s.url) {
                continue;
            }
            reply += `\n\t**${station}** - ${s.name}`;
        }
        message.channel.send(reply);
    },
    stop_radio: (message, bot) => {
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t leave your voice channel...');
        const GuildCheck = bot.guilds.get(message.guild.id);
        if (GuildCheck.voiceConnection) {
            try {
                dispatcher_radio.end();
            } catch (err) {
                return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
            }
        } else {
            return message.channel.send('Make sure the bot is in a voice channel to leave.');
        } 
    }
};
