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
const serverApiUrl = "YOUR_SERVER_API_URL";
const webAppUrl = "https://magnificent-speculoos-ca08a4.netlify.app";
// Cake options with descriptions and picture links
const cakes = [
  {
    name: "Шоколадный Лазурь",
    description: "Много крема и шоколада!!!",
    price: 25000,
    pictureLink:
      "https://unsplash.com/photos/white-cake-with-chocolate-syrup-on-white-ceramic-plate-vdx5hPQhXFk",
  },
  {
    name: "Лимонный Лазурь",
    description: "Лимон и бисквит!!!",
    price: 20000,
    pictureLink:
      "https://unsplash.com/photos/a-three-tiered-cake-with-figs-on-top-of-it-4on47p0-bk4",
  },
  {
    name: "Классический морковный",
    description: "Полезный и сытный!!!",
    price: 12000,
    pictureLink:
      "https://unsplash.com/photos/sliced-chocolate-cake-beside-fork-on-plate-P_l1bJQpQF0",
  },
  {
    name: "Чернослив и апельсин",
    description: "Какой-то текст",
    price: 8000,
    pictureLink:
      "https://unsplash.com/photos/icing-covered-cake-beside-cupcakes-3962cSRPwOo",
  },
  // Add more cake options as needed
];

// User data store (simulating a simple personal cabinet)
const userData = {};

// Create a new bot instance
const bot = new TelegramBot(token, { polling: true });

// Command to start the bot

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, "Ниже появится кнопка, заполни форму", {
      reply_markup: {
        keyboard: [
          [{ text: "Заполнить форму", web_app: { url: webAppUrl + "/form" } }],
        ],
      },
    });

    await bot.sendMessage(
      chatId,
      "Заходи в наш интернет магазин по кнопке ниже",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Сделать заказ", web_app: { url: webAppUrl } }],
          ],
        },
      }
    );
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      console.log(data);
      await bot.sendMessage(chatId, "Спасибо за обратную связь!");
      await bot.sendMessage(chatId, "Ваша страна: " + data?.country);
      await bot.sendMessage(chatId, "Ваша улица: " + data?.street);

      setTimeout(async () => {
        await bot.sendMessage(chatId, "Всю информацию вы получите в этом чате");
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }
});

app.post("/web-data", async (req, res) => {
  const { queryId, products = [], totalPrice } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Успешная покупка",
      input_message_content: {
        message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products
          .map((item) => item.title)
          .join(", ")}`,
      },
    });
    return res.status(200).json({});
  } catch (e) {
    return res.status(500).json({});
  }
});

// Function to show user's orders
function showMyOrders(chatId) {
  const userOrders = userData[chatId].orders || [];

  if (userOrders.length > 0) {
    const orderText = userOrders.map((order, index) => {
      return `${index + 1}. ${order.cake} - $${order.price}`;
    });

    bot.sendMessage(chatId, `Ваши заказы:\n${orderText.join("\n")}`);
  } else {
    bot.sendMessage(chatId, "У вас еще нету заказов.");
  }
}

// Function to suggest payment options
function suggestPayment(chatId) {
  bot.sendMessage(chatId, "Прошу выберите способ оплаты:", {
    reply_markup: {
      keyboard: [
        ["💳 Через карту", "📱 Мобильный платеж"],
        ["❌ Отменить оплату"],
      ],
      resize_keyboard: true,
    },
  });
}

// Handle order confirmation
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  switch (messageText) {
    case "🛒 Заказать сейчас":
      suggestPayment(chatId);
      break;
    case "❌ Отменить заказ":
      cancelOrder(chatId);
      break;
    default:
      // Handle other messages
      break;
  }
});

// Handle payment selection
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  switch (messageText) {
    case "💳 Через карту":
    case "📱 Мобильный платеж":
      processPayment(chatId, messageText);
      break;
    case "❌ Отменить оплату":
      cancelPayment(chatId);
      break;
    default:
      // Handle other messages
      break;
  }
});

// Function to confirm the order and initiate payment
function confirmOrder(chatId) {
  const selectedCake = userData[chatId].selectedCake;

  // Simulate successful payment
  const paymentSuccessful = Math.random() < 0.8; // 80% success rate

  if (paymentSuccessful) {
    // Save the order to user data
    userData[chatId].orders = userData[chatId].orders || [];
    userData[chatId].orders.push({
      cake: selectedCake.name,
      price: selectedCake.price,
    });

    // Send order details to the server API
    axios
      .post(serverApiUrl + "/orders", {
        chatId,
        orderDetails: `Торт/Пирог: ${selectedCake.name}\nЦена: $${selectedCake.price}`,
      })
      .then((response) => {
        bot.sendMessage(
          chatId,
          "Ваш заказ был принят! Вы свяжемся с вами очень скоро.",
          {
            reply_markup: {
              remove_keyboard: true, // Remove the custom keyboard
            },
          }
        );
      })
      .catch((error) => {
        bot.sendMessage(chatId, "Упс! Что-то пошло не так.");
      });
  } else {
    bot.sendMessage(chatId, "Ошибка платежа. Пожалуйста, попробуйте еще раз.");
  }

  // Clear selected cake
  userData[chatId].selectedCake = null;
}

// Function to process payment
function processPayment(chatId, paymentOption) {
  const selectedCake = userData[chatId].selectedCake;

  // Simulate successful payment
  const paymentSuccessful = Math.random() < 0.8; // 80% success rate

  if (paymentSuccessful) {
    // Save the order to user data
    userData[chatId].orders = userData[chatId].orders || [];
    userData[chatId].orders.push({
      cake: selectedCake.name,
      price: selectedCake.price,
    });

    // Send order details to the server API
    axios
      .post(serverApiUrl + "/orders", {
        chatId,
        orderDetails: `Торт/Пирог: ${selectedCake.name}\nЦена: $${selectedCake.price}\nPayment Option: ${paymentOption}`,
      })
      .then((response) => {
        bot.sendMessage(
          chatId,
          "Ваш заказ был принят! Пожалуйста, ожидайте, мы с вами скоро свяжемся.",
          {
            reply_markup: {
              remove_keyboard: true, // Remove the custom keyboard
            },
          }
        );
      })
      .catch((error) => {
        bot.sendMessage(chatId, "Упс! Что-то пошло не так..");
      });
  } else {
    bot.sendMessage(chatId, "Ошибка платежа. Пожалуйста, попробуйте еще раз.");
  }

  // Clear selected cake
  userData[chatId].selectedCake = null;
}

// Function to cancel the order
function cancelOrder(chatId) {
  userData[chatId].selectedCake = null;
  bot.sendMessage(chatId, "Заказ отменен.");
}

// Function to cancel the payment
function cancelPayment(chatId) {
  userData[chatId].selectedCake = null;
  bot.sendMessage(chatId, "Оплата отменена.");
}

const PORT = 8000;

app.listen(PORT, () => console.log("server started on PORT " + PORT));
