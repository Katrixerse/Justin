const request = require('node-superfetch');
exports.run = async (client, message, args) => {
    // switch to look if the client has the perm instead
    if (!message.member.hasPermission(`ATTACH_FILES`)) return message.channel.send(`You need the ATTACH_FILES permission to use this command.`);
    try {
        const text = args.join(' ');
         if (text === null) return message.channel.send("You need to provide text for the achievement");
             if (text.length > 25) return message.reply('Text must be under 25 characters.');
         const { body } = await request
             .get('https://www.minecraftskinstealer.com/achievement/a.php')
             .query({
                 i: 1,
                 h: 'Achievement Get!',
                 t: text
             });
         return message.channel.send({ files: [{ attachment: body, name: 'achievement.png' }] });
     } catch (err) {
         return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
     }
};

exports.conf = {
    guildOnly: false,
    aliases: ['achiev'],
    commandCategory: 'misc'
};

exports.help = {
    name: 'achievement',
    description: 'What will you achieve?.',
    usage: 'achievement [achievement-name]'
};