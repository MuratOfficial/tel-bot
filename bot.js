const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require("express");
const cors = require("cors");

// Telegram bot token obtained from BotFather
const token = "6740114531:AAHWjIeJnETdyOOPaDwe2v5L3gko_FR3kYo";

const app = express();

app.use(express.json());
app.use(cors());

// Server API endpoint for handling orders
const webAppUrl = "https://magnificent-speculoos-ca08a4.netlify.app";
// Cake options with descriptions and picture links

// User data store (simulating a simple personal cabinet)
const userData = {};

// Create a new bot instance
const bot = new TelegramBot(token, { polling: true });

// Command to start the bot

// Function to generate random delivery status
function generateRandomStatus() {
  const statuses = [
    "Статус: у курьера;\n Время доставки: 15 мин;\n Заказ: 154256",
    "Статус: подготовка заказа;\n Время подготовки: 10 мин;n Заказ: 154257",
    "Статус: готово к доставке;\n Ожидание: 10 мин;\n Заказ: 154258",
  ];

  return statuses[Math.floor(Math.random() * statuses.length)];
}

// Keyboard layout
const keyboard = [
  [{ text: "🍰 Меню", web_app: { url: webAppUrl } }],
  [
    { text: "🚚 Статус", callback_data: "status" },
    { text: "🗄 Кабинет", web_app: { url: `${webAppUrl}/cabinet` } },
  ],
  [
    { text: "📞 Контакты", callback_data: "contacts" },
    { text: "ℹ О нас", callback_data: "about_us" },
    { text: "🎁 Промо", web_app: { url: `${webAppUrl}/promo` } },
  ],
];

// Contacts inline keyboard
const contactsKeyboard = [
  [
    { text: "Телефон", callback_data: "tel" },
    { text: "Instagram", url: "https://www.instagram.com/" },
  ],
  [
    { text: "WhatsApp", url: "https://wa.link/ldvbeb" },
    { text: "Telegram", url: "https://t.me/OrderCakeAlmatyBot" },
  ],
  [{ text: "⬅️ Назад", callback_data: "back_to_menu" }],
];

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const previewText = `
  *Привет, готов к работе!*

Нажмите "Меню" и выберите из ассортимента интересующий товар.

Через бот вы можете проследить свой заказ, узнавать статус, время доставки. А также можете через личный кабинет посмотреть свои бонусы, скидки и историю заказов
  
`;
  bot.sendMessage(chatId, previewText, {
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: keyboard },
  });
});

bot.on("callback_query", (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  switch (data) {
    case "status":
      // Answer with a random delivery status
      bot.sendMessage(chatId, generateRandomStatus());
      break;
    case "contacts":
      // Answer with contact options using an inline keyboard
      bot.sendMessage(chatId, "Контакты:", {
        reply_markup: { inline_keyboard: contactsKeyboard },
      });
      break;
    case "about_us":
      // Generate "About us" text and add the photo when you have it
      const aboutUsText =
        "Добро пожаловать в Dessert House! Мы — ведущая служба заказа тортов, призванная доставлять счастье в виде вкусных тортов. Наша команда опытных пекарей гарантирует, что каждый торт станет шедевром вкуса и дизайна. Заказывайте у нас и испытайте радость от вкуснейших тортов.";

      // Add the photo when you have the actual link
      bot.sendPhoto(
        chatId,
        "https://unsplash.com/photos/girl-baking-cookies-family-teenage-women-two-of-multi-ethnic-are-cooking-bread-bakery-in-the-kitchen-at-home-weekend-cooking-activity-for-young-people-lifestyles-concept-online-cooking-class-that-stay-at-home-s_a55p9ox-k",
        { caption: aboutUsText }
      );
      break;
    case "tel":
      bot.sendMessage(chatId, "Tel1: +77777777\n Tel2: +7 (7252) 752525");
      break;
    case "back_to_menu":
      // Return to the main menu
      bot.sendMessage(
        chatId,
        `Нажмите "Меню" и выберите из ассортимента интересующий товар.
        
Через бот вы можете проследить свой заказ, узнавать статус, время доставки. А также можете через личный кабинет посмотреть свои бонусы, скидки и историю заказов`,
        {
          reply_markup: { inline_keyboard: keyboard },
        }
      );
      break;
    // Add more cases for other buttons as needed
  }
});

// app.post("/web-data", async (req, res) => {
//   const { queryId, products = [], totalPrice } = req.body;
//   try {
//     await bot.answerWebAppQuery(queryId, {
//       type: "article",
//       id: queryId,
//       title: "Успешная покупка",
//       input_message_content: {
//         message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products
//           .map((item) => item.title)
//           .join(", ")}`,
//       },
//     });
//     return res.status(200).json({});
//   } catch (e) {
//     return res.status(500).json({});
//   }
// });

const PORT = 8000;

app.listen(PORT, () => console.log("server started on PORT " + PORT));
