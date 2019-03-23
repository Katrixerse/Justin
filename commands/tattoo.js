const request = require('node-superfetch');
const fsn = require('fs-nextra');
exports.run = async (client, message, args) => {
  if (!message.guild.member(client.user).hasPermission('ATTACH_FILES')) return message.reply('Sorry, i dont have the perms to do this cmd i need ATTACH_FILES. :x:')
   const { Canvas } = require('canvas-constructor');
   const getSlapped = async (person) => {
    const plate = await fsn.readFile('./assets/images/the-ultimate-tattoo.png');
    const png = person.replace('.gif', '.png');
    const { body } = await request.get(png);
    return new Canvas(750, 1089)
    .setColor(0x6B363E)
    .addImage(plate, 0, 0, 750, 1089)
    .addImage(body, 200, 645, 320, 320, { type: 'round', radius: 156 })
    .toBuffer();
  }
     try {
        if (message.mentions.users.size < 1) {
            const person = message.author.avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({ files: [{ attachment: result, name: 'tattoo.png' }] });
        } else {
            const person = message.mentions.users.first().avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({ files: [{ attachment: result, name: 'tattoo.png' }] });
        }
  } catch (error) {
    throw error;
  }
}

exports.conf = {
    guildOnly: false,
    aliases: ['tat'],
    commandCategory: 'fun'
};

exports.help = {
    name: 'tattoo',
    description: 'Get users avatar as a tattoo [CANVAS].',
    usage: 'tattoo @User'
};