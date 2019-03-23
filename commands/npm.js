const Discord = require("discord.js");
const request = require('node-superfetch');
const moment = require('moment');
exports.run = async (client, message, args) => {
   const pkg = args.join(' ');
   if (!pkg) return message.channel.send('Provided no input.');
   try {
    const { body } = await request.get(`https://registry.npmjs.com/${pkg}`);
    if (body.time.unpublished) return message.channel.send('This package no longer exists.');
    const version = body.versions[body['dist-tags'].latest];
    const maintainers = body.maintainers.map(user => user.name);
    const dependencies = version.dependencies ? Object.keys(version.dependencies) : null;
    const embed = new Discord.RichEmbed()
        .setColor(0xCB0000)
        .setAuthor('NPM', 'https://i.imgur.com/ErKf5Y0.png', 'https://www.npmjs.com/')
        .setTitle(body.name)
        .setURL(`https://www.npmjs.com/package/${pkg}`)
        .setDescription(body.description || 'No description.')
        .addField('Version', body['dist-tags'].latest, true)
        .addField('License', body.license || 'None', true)
        .addField('Author', body.author ? body.author.name : '???', true)
        .addField('Creation Date', moment.utc(body.time.created).format('MM/DD/YYYY h:mm A'), true)
        .addField('Modification Date', moment.utc(body.time.modified).format('MM/DD/YYYY h:mm A'), true)
        .addField('Main File', version.main || 'index.js', true)
        .addField('Dependencies', dependencies && dependencies.length ? dependencies.join(', ') : 'None')
        .addField('Maintainers', maintainers.join(', '));
    return message.channel.send(embed);
        } catch (err) {
            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'search'
};

exports.help = {
    name: 'npm',
    description: 'Search on npm for a package.',
    usage: 'npm'
};
