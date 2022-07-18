require('dotenv').config();
const { default: mongoose } = require('mongoose');
const { Telegraf, Scenes, session } = require('telegraf')
const controllers = require('./controllers');
const { baseKeyboard } = require('./keyboards');
const CronJob = require('cron').CronJob;
const scenes = require('./scenes');

const start = async () => {
    await mongoose.connect('mongodb://localhost:27017/BinanceParser').catch(e => console.error(e));

    const bot = new Telegraf(process.env.TOKEN)

    const stage = new Scenes.Stage(scenes);
    bot.use(session());
    bot.use(stage.middleware());

    // new CronJob(
    //     '0 */5 * * * *', // every 5 minute
    //     controllers.parse,
    //     null,
    //     true,
    //     'America/Los_Angeles'
    // );

    //controllers.parse();

    bot.start(async ctx => await ctx.reply('Welcome!\nBinance price checker v1.0.0.', baseKeyboard));

    bot.on('callback_query', async (ctx) => {
        const query = ctx.update.callback_query;
        const action = query.data;
        const sender = query.from.id;
        const chat_id = query.message?.chat.id || sender;

        if (JSON.parse(process.env.ADMINS).includes(sender) === false) {
            return await ctx.reply("You don`t have rights to use it. Send your id to the administrator: " + chat_id);
        }

        if (action === undefined || Object.keys(controllers.endpoints).includes(action) === false) {
            return await ctx.reply("Error. Non-existent action");
        }

        return await Object.values(controllers.endpoints)[Object.keys(controllers.endpoints).indexOf(action)](ctx);
    });

    bot.launch()
}

start();