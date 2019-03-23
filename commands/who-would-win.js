const request = require('node-superfetch');
const fsn = require('fs-nextra');
exports.run = async (client, message, args) => {
  if (!message.guild.member(client.user).hasPermission('ATTACH_FILES')) return message.reply('Sorry, i dont have the perms to do this cmd i need ATTACH_FILES. :x:')
const { Canvas } = require('canvas-constructor');
   if (message.mentions.users.size < 1) return message.channel.send("You didn't mention a user to slap");
   const getSlapped = async (slapper, slapped) => {
    const plate = await fsn.readFile('./assets/images/Who-Would-Win.png');
    const pngSlapper = slapper.replace('.gif', '.png');
    const pngSlapped = slapped.replace('.gif', '.png');
    const Slapper = await request.get(pngSlapper);
    const Slapped = await request.get(pngSlapped);
    return new Canvas(802 , 500)
      .addImage(plate, 0, 0, 802 , 500)
      .addImage(Slapper.body, 41, 124, 318, 325)
      .addImage(Slapped.body, 461, 124, 318, 325)
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