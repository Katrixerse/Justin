exports.run = (client, message, args) => {

}

exports.conf = {
    guildOnly: true,
    aliases: [],
    commandCategory: 'moderation'
};

exports.help = {
    name: 'punishments',
    description: 'Allows a mod to see how many times as user was banned/kicked/warned/muted.',
    usage: 'punishments @user'
};