const Discord = require("discord.js");
const request = require('node-superfetch');
const moment = require('moment')
exports.run = async (client, message, args) => {
    const author = args[0]
    const repository = args.slice(1).join(" ")
	try {
        const { body } = await request
        .get(`https://api.github.com/repos/${author}/${repository}`)
        .set({ Authorization: `Basic ${`${GITHUB_USERNAME}:${GITHUB_PASSWORD}`}` });
    const descriptionfix = body.description.substr(0, 300);
    const embed = new Discord.RichEmbed()
        .setColor(0xFFFFFF)
        .setAuthor('GitHub', 'https://i.imgur.com/e4HunUm.png', 'https://github.com/')
        .setTitle(body.full_name)
        .setURL(body.html_url)
        .setDescription(body.description ? (descriptionfix) : 'No description.')
        .setThumbnail(body.owner.avatar_url)
        .addField('Stars', body.stargazers_count, true)
        .addField('Forks', body.forks, true)
        .addField('Issues', body.open_issues, true)
        .addField('Language', body.language || 'Unknown', true)
        .addField('Creation Date', moment.utc(body.created_at).format('MM/DD/YYYY h:mm A'), true)
        .addField('Modification Date', moment.utc(body.updated_at).format('MM/DD/YYYY h:mm A'), true);
        message.channel.send(embed)
    } catch (err) {
        if (err.status === 404) return message.channel.send('Could not find any author/resp by ' + author + "/" + repository + '.');
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
}
   
exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: 'github',
    description: 'Search github.',
    usage: 'github'
};