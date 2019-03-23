const Discord = require('discord.js');
exports.run = async (client, message, args) => {
    let messagez = args.join(' ');
    try {
        if (messagez.length < 1) return message.channel.send('Incorrect format. !reminder <minutes> <message>');
        return new Promise((resolve) => {
          if (!isNaN(messagez[0])) {
            const time = parseInt(messagez[0]);
            if (time > 2880 || isNaN(time)) return message.channel.send('Maximum time is 2 days (2880 minutes)');
            if (time < 1) return message.channel.send('Time must be at least 1 minute.');
            setTimeout(() => {
              message.reply(`Remember: ${messagez.split(' ').slice(1).join(' ')}!`);
            }, time * 60000);
            const minutemessage = time === 1 ? 'minute' : 'minutes';
            return message.channel.send(`Reminding you in ${time} ${minutemessage}.`);
          }
      
          const results = chrono.parse(messagez);
          if (results.length === 0) return message.channel.send('Error parsing date. Try using format: !remind <minutes> <message>');
      
          let endTime = moment(results[0].start.date());
          const currentTime = new moment();
          let duration = moment.duration(endTime.diff(currentTime));
          let minutes = Math.round(duration.asMinutes());
      
          if (minutes < 1) {
            if (results[0].end) {
              endTime = results[0].end.date();
              duration = moment.duration(endTime.diff(currentTime));
              minutes = duration.asMinutes();
            }
            if (minutes < 1) {
              return message.channel.send('Time must be at least 1 minute.')
            }
          }
          if (minutes > 2880) return message.channel.send('Maximum time is 2 days (2880 minutes)');
      
          setTimeout(() => {
           message.reply(`Remember: "${messagez}"!`);
          }, minutes * 60000);
          const minutemessage = minutes === 1 ? 'minute' : 'minutes';
          return message.channel.send(`Reminding you in ${minutes} ${minutemessage} for ${messagez}.`);
        });
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
    name: 'reminder',
    description: 'Will remind you of something later.',
    usage: 'reminder'
};