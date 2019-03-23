const request = require('node-superfetch');
const fsn = require('fs-nextra');
exports.run = async (client, message, args) => {
    if (!message.guild.member(client.user).hasPermission('ATTACH_FILES')) return message.reply('Sorry, I don\'t have the permission to do this command I need ATTACH_FILES. :x:')
    const { Canvas } = require('canvas-constructor');
    const getSlapped = async (person) => {
        const plate = await fsn.readFile('./assets/images/look-what-karen-have.png');
        const png = person.replace('.gif', '.png');
        const { body } = await request.get(png);
        return new Canvas(768, 432)
        .rotate(-6.5 * (Math.PI / 180))
        .addImage(body, 514, 50, 512, 512)
        .rotate(6.5 * (Math.PI / 180))
        .addImage(plate, 0, 0, 768, 432)
        .toBuffer();
    }
    try {
        if (message.mentions.users.size < 1) {
            const person = message.author.avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({ files: [{ attachment: result, name: 'look.png' }] });
        } else {
            const person = message.mentions.users.first().avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({ files: [{ attachment: result, name: 'look.png' }] });
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
    name: 'look',
    description: 'Look at this [CANVAS].',
    usage: 'look @User'
};