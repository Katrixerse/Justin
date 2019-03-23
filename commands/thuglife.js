const request = require('node-superfetch');
const fsn = require('fs-nextra');
exports.run = async (client, message, args) => {
  if (!message.guild.member(client.user).hasPermission('ATTACH_FILES')) return message.reply('Sorry, i dont have the perms to do this cmd i need ATTACH_FILES. :x:')
   const { Canvas } = require('canvas-constructor');
   const getSlapped = async (person) => {
    const plate = await fsn.readFile('./assets/images/thug-life.png');
    const png = person.replace('.gif', '.png');
    const { body } = await request.get(png);
    return new Canvas(330, 330)
    .resetTransformation()
    .addImage(body, 0, 0, 330, 330)
    .addImage(plate, 0, 0, 330, 330)
    .toBuffer();
  }
     try {
        if (message.mentions.users.size < 1) {
            const person = message.author.avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({ files: [{ attachment: result, name: 'thuglife.png' }] });
        } else {
            const person = message.mentions.users.first().avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({ files: [{ attachment: result, name: 'thuglife.png' }] });
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
    name: 'thuglife',
    description: 'Welcome to the thuglife [CANVAS].',
    usage: 'thuglife @User'
};