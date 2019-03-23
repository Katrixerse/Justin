const request = require('node-superfetch');
const fsn = require('fs-nextra');
exports.run = async (client, message, args) => {
    const user_input = args.slice(1).join(' ')
    if (user_input < 1) return message.channel.send('Need to provide an input to use this command.');
    if (user_input.length >= 40) return message.channel.send('Input can not be more than 40 characters.')
  if (!message.guild.member(client.user).hasPermission('ATTACH_FILES')) return message.reply('Sorry, i dont have the perms to do this cmd i need ATTACH_FILES. :x:')
   const { Canvas } = require('canvas-constructor');
   const getSlapped = async (slapped) => {
    const plate = await fsn.readFile('./assets/images/bye-mom.png');
    const pngSlapped = slapped.replace('.gif', '.png');
    const Slapped = await request.get(pngSlapped);
    return new Canvas(680, 632)
    .addImage(plate, 0, 0, 680, 632)
    .rotate(-25.5 * (Math.PI / 180))
    .setTextFont('26px Impact')
    .addText(`${user_input}`, 62, 708)
    .rotate(25.5 * (Math.PI / 180))
    .addImage(Slapped.body, 84, 327, 169, 169, { type: 'round', radius: 85 })
    .toBuffer();
  }
     try {
      if (message.mentions.users.size < 1) {
        const slapped = message.author.avatarURL;
        const result = await getSlapped(slapped);
        await message.channel.send({ files: [{ attachment: result, name: 'bye-mom.png' }] });
      } else {
        const slapped = message.mentions.users.first().avatarURL;
        const result = await getSlapped(slapped);
        await message.channel.send({ files: [{ attachment: result, name: 'bye-mom.png' }] });
      }
  } catch (error) {
    throw error;
  }
}

exports.conf = {
    guildOnly: false,
    aliases: ['brazzer'],
    commandCategory: 'fun'
};

exports.help = {
    name: 'byemom',
    description: 'Use the bye mom meme template [CANVAS].',
    usage: 'byemom @User [input]'
};