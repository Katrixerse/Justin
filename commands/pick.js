const request = require('node-superfetch');
const fsn = require('fs-nextra');
exports.run = async (client, message, args) => {
  if (!message.guild.member(client.user).hasPermission('ATTACH_FILES')) return message.reply('Sorry, i dont have the perms to do this cmd i need ATTACH_FILES. :x:')
const { Canvas } = require('canvas-constructor');
   if (message.mentions.users.size < 1) return message.channel.send("You didn't mention a user to slap");
   const getSlapped = async (slapper, slapped) => {
    const plate = await fsn.readFile('./assets/images/drakeposting.png');
    const pngSlapper = slapper.replace('.gif', '.png');
    const pngSlapped = slapped.replace('.gif', '.png');
    const Slapper = await request.get(pngSlapper);
    const Slapped = await request.get(pngSlapped);
    return new Canvas(1024 , 1024)
      .addImage(plate, 0, 0, 1024 , 1024)
      .addImage(Slapper.body, 512, 0, 512, 512)
      .addImage(Slapped.body, 512, 512, 512, 512)
      .restore()
      .toBuffer();
  }
  try {
    const slapped = message.mentions.users.first().avatarURL;
    const slapper = message.author.avatarURL;
    const result = await getSlapped(slapper, slapped);
    await message.channel.send({ files: [{ attachment: result, name: 'drake.png' }] });
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
    name: 'pick',
    description: 'Pick one user over the other [CANVAS].',
    usage: 'pick @User'
  };