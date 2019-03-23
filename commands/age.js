exports.run = async (client, message, args) => {
    try {
        const year = args.join(' ')
        if (year < 1) return message.channel.send("Didn't provide any text to embed")
        if (year.length > 2047) return message.channel.send("Can't embed for than 2047 characters")
        const currentYear = new Date().getFullYear();
		return message.channel.send(`Someone born in ${year} would be ${currentYear - year} years old.`);
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
    name: 'age',
    description: 'Responds with how old someone is being born in a certain year.',
    usage: 'age [year]'
};