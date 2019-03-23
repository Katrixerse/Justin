exports.run = async (client, message, args) => {
    if (message.author.id !== "130515926117253122") return message.channel.send("Only bot owner can use this command")
    const code = args.join(' ');
    if (!code) return message.channel.send('You provided no input are you stupid?');
    exec(code, (error, stdout, stderr) => {
        const input = `\`\`\`Bash\n${code}\n\`\`\``;
        if (error) {
            let output = `\`\`\`Bash\n${error}\n\`\`\``;
            message.channel.send(input, { split: true });
            return message.channel.send(output, { split: true });
        } else {
            const output = stderr || stdout;
            const output2 = `\`\`\`Bash\n${output}\n\`\`\``;
            message.channel.send(output2, { split: true });
        }
    });
};

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'owner'
};

exports.help = {
    name: 'exec',
    description: 'Sends a random cat picture.',
    usage: 'exec [console-command]'
};