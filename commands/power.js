const request = require('node-superfetch');
const fsn = require('fs-nextra');
exports.run = async (client, message, args) => {
  if (!message.guild.member(client.user).hasPermission('ATTACH_FILES')) return message.reply('Sorry, i dont have the perms to do this cmd i need ATTACH_FILES. :x:')
   const { Canvas } = require('canvas-constructor');
    if (message.mentions.users.size < 1) return message.channel.send("You didn't mention a user to give them the power.");
   const getSlapped = async (person) => {
    const plate = await fsn.readFile('./assets/images/i-have-the-power.png');
    const png = person.replace('.gif', '.png');
    const { body } = await request.get(png);
    return new Canvas(720, 536)
    .setColor(0x00A2E8)
    .addImage(plate, 0, 0, 720, 536)
    .addImage(body, 345, 23, 169, 169, { type: 'round', radius: 85 })
    .toBuffer();
  }
     try {
    const person = message.mentions.users.first().avatarURL;
    const result = await getSlapped(person);
    await message.channel.send({ files: [{ attachment: result, name: 'power.png' }] });
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
    name: 'power',
    description: 'Pick a user to make them he-man. [CANVAS].',
    usage: 'power @User'
};