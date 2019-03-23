const request = require('node-superfetch');
const fsn = require('fs-nextra');
exports.run = async (client, message, args) => {
  if (!message.guild.member(client.user).hasPermission('ATTACH_FILES')) return message.reply('Sorry, I dont have the permission to do this command I need ATTACH_FILES. :x:')
    const { Canvas } = require('canvas-constructor');
    if (message.mentions.users.size < 1) return message.channel.send("You didn't mention a user to have a crush on them");
    const getSlapped = async (slapper, slapped) => {
    const plate = await fsn.readFile('./assets/images/plate_crush.png');
    const pngSlapper = slapper.replace('.gif', '.png');
    const pngSlapped = slapped.replace('.gif', '.png');
    const Slapper = await request.get(pngSlapper);
    const Slapped = await request.get(pngSlapped);
      return new Canvas(600, 873)
    .rotate(-0.09)
    .addImage(Slapped.body, 109, 454, 417, 417)
    .resetTransformation()
    .addImage(plate, 0, 0, 600, 873)
    .addImage(Slapper.body, 407, 44, 131, 131, { type: 'round', radius: 66 })
    .restore()
    .toBuffer();
  }
  try {
    const slapped = message.mentions.users.first().avatarURL;
    const slapper = message.author.avatarURL;
    const result = await getSlapped(slapper, slapped);
    await message.channel.send({ files: [{ attachment: result, name: 'crush.png' }] });
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
    name: 'crush',
    description: 'Have a crush on a user [CANVAS].',
    usage: 'crush @User'
};