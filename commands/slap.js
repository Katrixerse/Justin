const request = require('node-superfetch');
const fsn = require('fs-nextra');
exports.run = async (client, message, args) => {
  if (!message.guild.member(client.user).hasPermission('ATTACH_FILES')) return message.reply('Sorry, i dont have the perms to do this cmd i need ATTACH_FILES. :x:')
    const { Canvas } = require('canvas-constructor');
    if (message.mentions.users.size < 1) return message.channel.send("You didn't mention a user to slap");
    const getSlapped = async (slapper, slapped) => {
    const plate = await fsn.readFile('./assets/images/image_slap.png');
    const pngSlapper = slapper.replace('.gif', '.png');
    const pngSlapped = slapped.replace('.gif', '.png');
    const Slapper = await request.get(pngSlapper);
    const Slapped = await request.get(pngSlapped);
    return new Canvas(950 , 475)
      .addImage(plate, 0, 0, 950 , 475)
      .addImage(Slapper.body, 410, 107, 131, 131, { type: 'round', radius: 66 })
      .resetTransformation()
      .addImage(Slapped.body, 159, 180, 169, 169, { type: 'round', radius: 85 })
      .restore()
      .toBuffer();
  }
  try {
    const slapped = message.mentions.users.first().avatarURL;
    const slapper = message.author.avatarURL;
    const result = await getSlapped(slapper, slapped);
    await message.channel.send({ files: [{ attachment: result, name: 'who-would-win.png' }] });
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
    name: 'who-would-win',
    description: 'Who would win? [CANVAS].',
    usage: 'who-would-win @User'
};

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'fun'
};

exports.help = {
    name: 'slap',
    description: 'Slap the user.',
    usage: 'slap @User'
};