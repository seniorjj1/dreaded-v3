module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    
    const apiUrl = `https://api.dreaded.site/api/lyrics?title=${encodeURIComponent(text)}`;

    try {
        if (!text) return m.reply("Provide a song name!");
        
        const data = await fetchJson(apiUrl);

        if (!data.success || !data.result || !data.result.lyrics) {
            return m.reply(`Sorry, I couldn't find any lyrics for "${text}".`);
        }

        const { title, artist, link, thumb, lyrics } = data.result;

        const image = thumb || "https://i.imgur.com/Cgte666.jpeg";

        const caption = `**Title**: ${title}\n**Artist**: ${artist}\n\n${lyrics}`;
        
        await client.sendMessage(
            m.chat,
            {
                image: { url: image }, 
                caption: caption
            },
            { quoted: m }
        );
    } catch (error) {
        console.error(error);
        m.reply(`An error occurred while fetching the lyrics for "${text}".`);
    }
};