const { getSettings } = require('../../Mongodb/Settingsdb');
const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const newPrefix = args[0]; 

        let settings = await getSettings();

        if (!settings) {
            const Settings = require('../../Mongodb/Schemas/settingsSchema');
            settings = new Settings();
            await settings.save();
        }

        if (newPrefix === 'null') {
            if (!settings.prefix) {
                return await m.reply(`✅ The bot was already prefixless.`);
            }
            settings.prefix = "";
            await settings.save();
            await m.reply(`✅ The bot is now prefixless.`);
        } else if (newPrefix) {
            if (settings.prefix === newPrefix) {
                return await m.reply(`✅ The prefix was already set to: ${newPrefix}`);
            }
            settings.prefix = newPrefix;
            await settings.save();
            await m.reply(`✅ Prefix has been updated to: ${newPrefix}`);
        } else {
            await m.reply(`📄 Current prefix: ${settings.prefix || 'No prefix set.'}\n\nUse 'prefix null' to remove the prefix or 'prefix <any symbol>' to set a specific prefix.`);
        }
    });
};