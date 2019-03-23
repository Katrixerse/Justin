const Discord = require("discord.js");
exports.run = async (client, message, args) => {
    var never_have_i = [
        "injured myself while trying to impress a girl or boy I was interested in.",
        "had to run to save my life.",
        "taken food out of a trash can and eaten it.",
        "cried / flirted my way out of a speeding ticket.",
        "taken part in a talent show.",
        "made money by performing on the street.",
        "broken something at a friend’s house and then not told them.",
        "snooped through a friend’s bathroom or bedroom without them knowing.",
        "ruined someone else’s vacation.",
        "walked for more than six hours.",
        "jumped from a roof.",
        "shoplifted.",
        "set my or someone else’s hair on fire on purpose.",
        "ridden an animal.",
        "had a bad fall because I was walking and texting.",
        "been arrested.",
        "pressured someone into getting a tattoo or piercing.",
        "gone surfing.",
        "walked out of a movie because it was bad.",
        "broken a bone.",
        "tried to cut my own hair.",
        "completely forgot my lines in a play.",
        "shot a gun.",
        "had a surprise party thrown for me.",
        "cheated on a test.",
        "dined and dashed.",
        "gotten stitches.",
        "fallen in love at first sight.",
        "had a paranormal experience.",
        "woken up and couldn’t move.",
        "accidentally said “I love you” to someone.",
        "hitchhiked.",
        "been trapped in an elevator.",
        "sung karaoke in front of people.",
        "been on TV or the radio.",
        "pressed send and then immediately regretted it.",
        "been so sun burnt I couldn’t wear a shirt.",
        "had a crush on a friend’s parent.",
        "been awake for two days straight.",
        "thrown up on a roller coaster.",
        "snuck into a movie.",
        "accidentally sent someone to the hospital.",
        "dyed my hair a crazy color.",
        "had a physical fight with my best friend.",
        "fallen in love at first sight.",
        "had someone slap me across the face.",
        "worked with someone I hated with the burning passion of a thousand suns.",
        "danced in an elevator.",
        "cried in public because of a song.",
        "texted for four hours straight.",
        "chipped a tooth.",
        "gone hunting.",
        "had a tree house.",
        "thrown something into a TV or computer screen.",
        "been to a country in Asia.",
        "been screamed at by a customer at my job.",
        "spent a night in the woods with no shelter.",
        "read a whole novel in one day.",
        "gone vegan.",
        "been without heat for a winter or without A/C for a summer.",
        "worn glasses without lenses.",
        "gone scuba diving.",
        "lied about a family member dying as an excuse to get out of doing something.",
        "bungee jumped.",
        "been to a country in Africa.",
        "been on a fad diet.",
        "been to a fashion show.",
        "been electrocuted.",
        "stolen something from a restaurant.",
        "had a bad allergic reaction.",
        "been in an embarrassing video that was uploaded to YouTube.",
        "thought I was going to drown.",
        "worked at a fast food restaurant.",
        "fainted.",
        "looked through someone else’s phone without their permission."
    ]
    const roasts = roast[Math.floor(Math.random() * roast.length)];
    const embed = new Discord.RichEmbed()
        .setColor(0x00A2E8)
        .setDescription("Never have I ever " + roasts);
    message.channel.send(embed);
}

exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'fun'
};

exports.help = {
    name: 'never-have-i-ever',
    description: 'Sends you a random never-have-i-ever.',
    usage: 'never-have-i-ever'
};