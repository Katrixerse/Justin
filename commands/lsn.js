exports.run = async (client, message, args) => {
    try {
        const { body } = await request
            .get('https://www.reddit.com/r/TodayILearned.json')
            .query({
                limit: 1000
            });
        const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if (!allowed.length) return message.channel.send('It seems the Today I Learned are gone right now. Try again later!');
        return message.channel.send(allowed[Math.floor(Math.random() * allowed.length)].data.title);
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'fun'
};

exports.help = {
    name: 'lsn',
    description: 'Learn something new.',
    usage: 'lsn'
};