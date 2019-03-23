const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    let reason = args.join(' ');
    if (reason.length < 1) return message.channel.send('You did not give the bot a question');
    var ball = ['It is certain.', 'No doubt about it.', 'No chance.', 'Maybe, time will tell.', 'No way.', 'Concentrate and try again.', ' As I see it, yes', 'Outlook good', 'Most likely', 'Better not tell you now', 'My sources say no', 'Signs point to yes', 'Yes definitely', 'It is decidedly so', 'As I see it, yes', 'My sources say no', 'My sources say no', 'Outlook not so good', 'Very doubtful'];
    try {
        if (reason.includes('?')) {
            const embed = new Discord.RichEmbed()
                .setColor(0x6B363E)
                .addField("You asked:", reason)
                .addField("Justin says:", ball[Math.floor(Math.random() * ball.length)])
                .setThumbnail("http://www.pngmart.com/files/3/8-Ball-Pool-Transparent-PNG.png")
            return message.channel.send(embed);
        } else {
            const embed = new Discord.RichEmbed()
                .setColor(0x6B363E)
                .addField("You asked:", `${reason}?`)
                .addField("Justin says:", ball[Math.floor(Math.random() * ball.length)])
                .setThumbnail("http://www.pngmart.com/files/3/8-Ball-Pool-Transparent-PNG.png")
            return message.channel.send(embed);
        }
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'misc'
};

exports.help = {
    name: '8ball',
    description: 'Ask the 8ball anything and get your answer.',
    usage: '8ball [question]'
};