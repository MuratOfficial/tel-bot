<h1 align="center">🤖 Telegram Test Bot (Node.js)</h1>
<p align="center">
  A lightweight Telegram bot built with Node.js for testing and experimentation using the Telegram Bot API.
</p>

<p align="center">
  <img src="https://img.shields.io/github/languages/top/MuratOfficial/tel-bot?style=flat-square" />
  <img src="https://img.shields.io/github/license/MuratOfficial/tel-bot?style=flat-square" />
  <img src="https://img.shields.io/github/stars/MuratOfficial/tel-bot?style=flat-square" />
</p>

---

## 📌 About

This project is a **Telegram bot prototype** developed in **JavaScript** using **Node.js**. It leverages the `node-telegram-bot-api` library to interact with the Telegram Bot API. Designed primarily for **testing and learning purposes**, it serves as a sandbox for experimenting with bot commands and message handling.

---

## 🧰 Tech Stack

- **Language**: JavaScript (Node.js)
- **Library**: [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
- **Environment Variables**: Managed via `.env` file

---

## ⚙️ Features

- ✅ Responds to basic commands like `/start` and `/help`
- ✅ Echoes text messages
- ✅ Simple keyboard and inline buttons
- 🧪 Playground for testing new Telegram bot features

---

## 📦 Getting Started

1. **Clone the repository:**
 ```bash
   git clone https://github.com/MuratOfficial/tel-bot.git
   cd tel-bot
  ```
2. **Install dependencies:**
  ```bash
    npm install
  ```
3. **Configure environment variables:**
  Create a `.env` file in the root directory and add your Telegram bot token:
  ```env
    TELEGRAM_BOT_TOKEN=your_bot_token_here
  ```
4. **Run the bot:**
  ```bash
    node bot.js
  ```
  *The bot will start and connect to Telegram using long polling.*

---

## 📌 Example Commands
* `/start` – Start the bot
* `/help` – Show help information
* Sends back any text you type

---

## 🚧 Disclaimer

This bot is **not intended for production use**. It serves only as a sandbox for learning and testing the Telegram Bot API. Use at your own discretion.

## 📄 License
Licensed under the MIT License. See the LICENSE file for details.

<p align="center"><b>Made with 🧪 by <a href="https://github.com/MuratOfficial">MuratOfficial</a></b></p>
