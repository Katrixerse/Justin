const fs = require("fs");
exports.run = (client, message, args) => {
    if (message.author.id !== "130515926117253122") return;
        const commandName = args.join('');
        if (commandName.length > 1) {
        if(!client.commands.has(commandName)) {
            return message.reply("That command does not exist");
          }
          delete require.cache[require.resolve(`./${commandName}.js`)];
          client.commands.delete(commandName);
          const props = require(`./${commandName}.js`);
          client.commands.set(commandName, props);
          message.reply(`The command ${commandName} has been reloaded.`);
    } else {
    fs.readdir("./commands/", (err, files) => {
        const filez = files.length
        if (err) return console.error(err.stack);
            files.forEach(file => {
                if(!file.endsWith("js")) return;
                delete require.cache[require.resolve(`./${file}`)];
                client.commands.delete(file);
                const f = require(`./${file}`);
                client.commands.set(f.help.name, f);
            })
            console.clear();
            message.channel.send(`Successfully reset \`${filez + 14}\` commands.`); 
        })      
    }
};
  
exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'owner'
  };
  
exports.help = {
    name: 'reload',
    description: 'Reloads all commands [Bot creator only]',
    usage: 'reload'
  };