exports.run = async (client, message, args) => {
    const base = args[0]
    const to = args[1]
    const amount = args[2]
    try {
        if (base === to) {
            return message.say(`Converting ${base} to ${to} is the same value.`);
        } else if (base === 'celsius') {
            if (to === 'fahrenheit') return message.say(`${amount}°C is ${(amount * 1.8) + 32}°F.`);
            else if (to === 'kelvin') return message.say(`${amount}°C is ${amount + 273.15}°K.`);
        } else if (base === 'fahrenheit') {
            if (to === 'celsius') return message.say(`${amount}°F is ${(amount - 32) / 1.8}°C.`);
            else if (to === 'kelvin') return message.say(`${amount}°F is ${(amount + 459.67) * (5 / 9)}°K.`);
        } else if (base === 'kelvin') {
            if (to === 'celsius') return message.say(`${amount}°K is ${amount - 273.15}°C.`);
            else if (to === 'fahrenheit') return message.say(`${amount}°K is ${(amount * 1.8) - 459.67}°F.`);
        } else {
            return message.channel.send("There was a error try again.")
        }
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

exports.conf = {
    guildOnly: false,
    aliases: ['temp'],
    commandCategory: 'misc'
};

exports.help = {
    name: 'tempature',
    description: 'Converts F to C or C to F.',
    usage: 'tempature'
};