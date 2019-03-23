const request = require('node-superfetch');
const fsn = require('fs-nextra');
exports.run = async (client, message, args) => {
  if (!message.guild.member(client.user).hasPermission('ATTACH_FILES')) return message.reply('Sorry, i dont have the perms to do this cmd i need ATTACH_FILES. :x:')
   const { Canvas } = require('canvas-constructor');
   const getSlapped = async (person) => {
    const plate = await fsn.readFile('./assets/images/plate_beautiful.png');
    const png = person.replace('.gif', '.png');
    const { body } = await request.get(png);
    return new Canvas(634, 675)
    .setColor(0x6B363E)
    .addRect(0, 0, 634, 675)
    .addImage(body, 423, 45, 168, 168)
    .addImage(body, 426, 382, 168, 168)
    .addImage(plate, 0, 0, 634, 675)
    .toBuffer();
  }
     try {
    if (message.mentions.users.size < 1) {
        const person = message.author.avatarURL;
        const result = await getSlapped(person);
        await message.channel.send({ files: [{ attachment: result, name: 'beautiful.png' }] });
    } else {
        const person = message.mentions.users.first().avatarURL || message.author.avatarURL;
        const result = await getSlapped(person);
        await message.channel.send({ files: [{ attachment: result, name: 'beautiful.png' }] });
    }
  } catch (error) {
    throw error;
  }
}

exports.conf = {
    guildOnly: false,
    aliases: ['beut'],
    commandCategory: 'fun'
};

exports.help = {
    name: 'beautiful',
    description: 'Makes a user beautiful [CANVAS].',
    usage: 'beautiful @User'
};