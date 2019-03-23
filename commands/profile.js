const request = require('node-superfetch');
const fsn = require('fs-nextra');
const { Canvas } = require('canvas-constructor');
const sql = require("sqlite");
sql.open("./assets/db/botsdb.sqlite");
exports.run = async (client, message, args) => {
    //sql.get(`SELECT * FROM guild_moderation_settings WHERE guildId ="${message.guild.id}"`).then(async row2 => {
       // if (!row2) return;
        //if (row2.levelsystem === "disabled") return message.channel.send("Level system has been disabled for this guild.");
        if (message.mentions.users.size < 1) { 
            sql.get(`SELECT * FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(async row => {
                
                let curcash = row.cash;
                let curbank = row.bank;
                let curxp = row.xp;
                let curlvl = row.level;
                let nxtLVL = curlvl * 600;
                let dif = nxtLVL - curxp;
                const networth = curcash + curbank;
                const usersusername = message.author.username
                const usersusernamefix = usersusername.substr(0, 13);
                const fixednetworth = networth.toLocaleString('en')
                const getSlapped = async (person) => {
                    const plate = await fsn.readFile('./assets/images/newprofilecard.png');
                    const png = person.replace('.gif', '.png');
                    const { body } = await request.get(png);
                    return new Canvas(970, 461)
                    .addImage(plate, 0, 0, 970, 461)
                    .addImage(body, 60, 49, 245, 269)
                    .setTextFont('70px Impact')
                    .addText(usersusernamefix, 340, 166)
                    .setTextFont('40px Impact')
                    .addText(row.xp + `/${curxp + dif}`, 406, 312)
                    .setTextFont('40px Impact')
                    .addText("$" + fixednetworth, 516, 352)
                    .setTextFont('40px Impact')
                    .addText(row.rep, 426, 402)
                    //.setTextFont('14px Impact')
                    //.addText(row.awards, 600, 70)
                    .setTextFont('82px Impact')
                    .setTextAlign("center")
                    .addText(row.level, 185, 405)
                    .setTextFont('64px Impact')
                    .addText(row.rank, 582, 245)
                    .toBuffer();
                  }
                     try {

                    const person = message.author.avatarURL;
                    const result = await getSlapped(person);
                    await message.channel.send({ files: [{ attachment: result, name: 'userprofile.png' }] });
                  } catch (error) {
                    throw error;
                  }
                })
            } else {
                let user = message.mentions.users.first();
                sql.get(`SELECT * FROM user_profiles WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`).then( async row3 => {
                    if (!row3) return;
                    if (row3.levelsystem === "disabled") return message.channel.send("Level system has been disabled for this guild.");
                
                    let curcash = row3.cash;
                    let curbank = row3.bank;
                    let curxp = row3.xp;
                    let curlvl = row3.level;
                    let nxtLVL = curlvl * 600;
                    let dif = nxtLVL - curxp;
                    const networth = curcash + curbank;
                    const usersusername = user.username
                    const usersusernamefix = usersusername.substr(0, 13);
                    const fixednetworth = networth.toLocaleString('en')
                    const getSlapped = async (person) => {
                        const plate = await fsn.readFile('./assets/images/newprofilecard.png');
                        const png = person.replace('.gif', '.png');
                        const { body } = await request.get(png);
                        return new Canvas(970, 461)

                        .addImage(plate, 0, 0, 970, 461)
                        .addImage(body, 60, 49, 245, 269)
                        .setTextFont('70px Impact')
                        .addText(usersusernamefix, 340, 166)
                        .setTextFont('40px Impact')
                        .addText(row3.xp + `/${curxp + dif}`, 406, 312)
                        .setTextFont('40px Impact')
                        .addText("$" + fixednetworth, 516, 352)
                        .setTextFont('40px Impact')
                        .addText(row3.rep, 426, 402)
                        .setTextFont('82px Impact')
                        .setTextAlign("center")
                        .addText(row3.level, 185, 405)
                        .setTextFont('64px Impact')
                        .addText(row3.rank, 582, 245)
                        .toBuffer();
                      }
                         try {
    
                        const person = user.avatarURL;
                        const result = await getSlapped(person);
                        await message.channel.send({ files: [{ attachment: result, name: 'userprofile.png' }] });
                      } catch (error) {
                        throw error;
                      }
                    })
            }
        //})
}

exports.conf = {
  guildOnly: false,
  aliases: [],
  commandCategory: 'leveling'
};

exports.help = {
  name: 'profile',
  description: 'See your profile.',
  usage: 'profile @User'
};