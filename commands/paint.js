const request = require('node-superfetch');
const fsn = require('fs-nextra');
exports.run = async (client, message, args) => {
    if (!message.guild.member(client.user).hasPermission('ATTACH_FILES')) return message.reply('Sorry, I don\'t have the permission to do this command I need ATTACH_FILES. :x:')
    const { Canvas } = require('canvas-constructor');
    const getSlapped = async (person) => {
        const plate = await fsn.readFile('./assets/images/bob-ross.png');
        const png = person.replace('.gif', '.png');
        const { body } = await request.get(png);
        return new Canvas(600, 755)
            .resetTransformation()
            .rotate(3 * (Math.PI / 180))
            .addImage(body, 30, 19, 430, 430)
            .rotate(-3 * (Math.PI / 180))
            .addImage(plate, 0, 0, 600, 755)
            .toBuffer();
    }
    try {
        if (message.mentions.users.size < 1) {
            const person = message.author.avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({ files: [{ attachment: result, name: 'paint.png' }] });
        } else {
            const person = message.mentions.users.first().avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({ files: [{ attachment: result, name: 'paint.png' }] });
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
    name: 'paint',
    description: 'Paint the user bob ross style [CANVAS].',
    usage: 'paint @User'
};