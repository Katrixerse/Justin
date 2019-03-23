const Discord = require("discord.js");
const request = require('node-superfetch');
exports.run = async (client, message, args) => {
    let user = args.join('_');
    try {
        const url = `https://api.roblox.com/users/get-by-username?username=${user}`;
        request.get(url).then(result => {
            const data = result.body.Id;
            if (user.length < 1) return message.channel.send("Need to provide a username to use this command")
            if (result.body.Id === "undefined") return message.channel.send("Couldn't find a roblox user by the name of " + user)
            const url2 = `https://api.roblox.com/ownership/hasasset?userId=${data}&assetId=102611803`;
            request.get(url2).then(a => {
                const Verifiedcheck = a.body
                const embed = new Discord.RichEmbed()
                    .setColor(0x6B363E)
                    .setTitle("Username: " + user)
                    .setDescription("User ID: " + data)
                    .addField("Verified", Verifiedcheck)
                    .setFooter("Profile Link: " + `https://web.roblox.com/users/${data}/profile`)
                    .setThumbnail("https://roblox.com/Thumbs/BCOverlay.ashx?username=" + user)
                    .setImage("http://www.roblox.com/Thumbs/Avatar.ashx?x=100&y=100&Format=Png&username=" + user);
                return message.channel.send({embed})
            })
        })
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'search'
};

exports.help = {
    name: 'roblox',
    description: 'Search up a user on roblox and get some info.',
    usage: 'roblox [user]'
};