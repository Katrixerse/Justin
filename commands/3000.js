const request = require('node-superfetch');
const fsn = require('fs-nextra');
exports.run = async (client, message, args) => {
    if (!message.guild.member(client.user).hasPermission('ATTACH_FILES')) return message.reply('Sorry, I don\'t have the permission to do this command I need ATTACH_FILES. :x:')
    const { Canvas } = require('canvas-constructor');
    const getSlapped = async (person) => {
        const plate = await fsn.readFile('./assets/images/3000-years.png');
        const png = person.replace('.gif', '.png');
        const { body } = await request.get(png);
        return new Canvas(856, 569)
            .resetTransformation()
            .addImage(plate, 0, 0, 856, 569)
            .addImage(body, 461, 127, 200, 200)
            .toBuffer();
    }
    try {
        if (message.mentions.users.size < 1) {
            const person = message.author.avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({ files: [{ attachment: result, name: '3000.png' }] });
        } else {
            const person = message.mentions.users.first().avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({ files: [{ attachment: result, name: '3000.png' }] });
        }
    } catch (error) {
        throw error;
    }
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'fun'
};

exports.help = {
    name: '3000',
    description: 'Its been 3000 years [CANVAS].',
    usage: '3000 @User'
};