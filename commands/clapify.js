exports.run = async (client, message, args) => {
    try {
        const year = args.join(' ')
        if (year < 1) return message.channel.send("Didn't provide any text to clapify.")
        if (year.length > 1023) return message.channel.send("Max length is 1023 characters")
        return message.channel.send(`:clap: ${year} :clap:`)
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