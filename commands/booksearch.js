const Discord = require("discord.js");
const request = require('node-superfetch');
exports.run = async (client, message, args) => {
    try {
const query = args.join(' ');
if (query < 1) return message.channel.send("Didnt provide a book title to search for.")
        const { body } = await request
            .get('https://www.googleapis.com/books/v1/volumes')
            .query({
                maxResults: 1,
                q: query,
                //maxAllowedMaturityRating: "NOT_MATURE",
                key: "Your key"
            });
        const description = body.items[0].volumeInfo.description
        const descriptionfix = description.substr(0, 600);
        const embed = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setTitle(body.items[0].volumeInfo.title)
            .addField("Author(s) ", body.items[0].volumeInfo.authors)
            .addField("Publisher ", body.items[0].volumeInfo.publisher)
            .addField("Page Count", body.items[0].volumeInfo.pageCount)
            .addField("Genres" , body.items[0].volumeInfo.categories.length ? body.items[0].volumeInfo.categories.join(', ') : '???')
            .addField("Description", body.items[0].volumeInfo.description ? descriptionfix : 'No description available.')
            .addField("Purchase link:", body.items[0].volumeInfo.canonicalVolumeLink)
            .setThumbnail(body.items[0].volumeInfo.imageLinks.thumbnail);
        const filtercheck = ["xxx", "porn", "sex", "18+", "nsfw", "hentai", "dick", "vagina", "nude", "pussy", "cum", "creampie"];
        if (filtercheck.some(word2 => body.items[0].volumeInfo.description.toLowerCase().includes(word2))) return message.channel.send("Not allowed to search nsfw content.");
        if (filtercheck.some(word3 => body.items[0].volumeInfo.title.toLowerCase().includes(word3))) return message.channel.send("Not allowed to google search nsfw content.");
        return message.channel.send(embed);
        } catch (err) {
            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
}
   
exports.conf = {
    guildOnly: false,
    aliases: [],
    commandCategory: 'search'
};

exports.help = {
    name: 'booksearch',
    description: 'Search on googles book api.',
    usage: 'booksearch'
};