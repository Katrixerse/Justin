const request = require('node-superfetch');
const fsn = require('fs-nextra');
exports.run = async (client, message, args) => {
  if (!message.guild.member(client.user).hasPermission('ATTACH_FILES')) return message.reply('Sorry, i dont have the perms to do this cmd i need ATTACH_FILES. :x:')
   const { Canvas } = require('canvas-constructor');
   const getSlapped = async (person) => {
    const plate = await fsn.readFile('./assets/images/plate_bill.png');
    const png = person.replace('.gif', '.png');
    const { body } = await request.get(png);
    return new Canvas(325, 150)
    .setColor(0x6B363E)
    .addImage(body, 80, 0, 150, 150)
    .addImage(plate, 0, 0, 325, 150)
    .toBuffer();
  }
     try {
        if (message.mentions.users.size < 1) {
            const person = message.author.avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({ files: [{ attachment: result, name: 'bill.png' }] });
        } else {
            const person = message.mentions.users.first().avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({ files: [{ attachment: result, name: 'bill.png' }] });
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
    name: 'bill',
    description: 'Make a users avatar the face on a bill [CANVAS].',
    usage: 'bill @User'
};