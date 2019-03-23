const ownerId = "130515926117253122"
const talkedRecently = new Set();
exports.run = (client, message, args) => {
    let feedback = args.join(' ');
        try {
        if (message.author.id === CodyID) return message.reply("you have been blacklisted from using this command");
        if (feedback.length < 10) return message.reply('Feedback is to short minimum of 10 characters.');
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Sorry! Please wait another 60 minutes to report another issue, this is to prevent spamming of this feature.");
            return;
        }
        talkedRecently.add(message.author.id);
        client.users.get(ownerId).send("Syntheti, a user has reported a issue on the bot: " + feedback + " | Sent in by: " + message.author.username);
        message.reply("thanks for choosing to report an issue it has been sent!")
        setTimeout(() => {
            talkedRecently.delete(message.author.id);
        }, 3600000);
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
    name: 'issue',
    description: 'Allows you to report a issue to the dev.',
    usage: 'issue'
  };