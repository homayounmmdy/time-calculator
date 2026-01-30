# Time Calculator ⏱️

A simple yet effective time management tool to help you track tasks and time spent throughout your day.

<img width="1027" height="717" alt="Screenshot 2025-07-23 171554" src="https://github.com/user-attachments/assets/cbe26801-ac1f-4838-a51f-cc281b58a9d1" />

🔗 **Live Demo:** [https://time-calculator-beta.netlify.app/](https://time-calculator-beta.netlify.app/)

## Features ✨

- 📝 Add tasks with time estimates  
- ✏️ Edit or delete existing entries  
- 🧹 Clear all entries with confirmation  
- ⏳ Track time spent on each task  
- 📊 View a live-updating log of completed tasks  
- 📅 See total time spent for the day  
- 💎 Fully **glassmorphic UI** with smooth animations  
- 🖥️ Responsive design (works on mobile & desktop)  
- 🧠 **Custom-styled alerts** that match the app’s aesthetic (no more browser-native popups!)  
- 💾 Data persisted locally via `localStorage`  
- 🛡️ Includes a service worker for offline support (PWA-ready)

## Why I Built This 🛠️

I created this tool to solve my own problem: constantly struggling to calculate time allocations with a normal calculator. Over time, I’ve enhanced it with a polished UI, better user feedback, and seamless data persistence so it’s not just functional, but also a joy to use. This project helps me (and hopefully you!) better manage daily tasks and time.

## Technologies Used 💻

- HTML5  
- CSS3 (with glassmorphism, backdrop filters, and custom scrollbars)  
- Vanilla JavaScript (ES6+)  
- LocalStorage for data persistence  
- Service Worker for PWA capabilities  

## How to Use 🚀

1. Enter your task name  
2. Add the time required (in hours/minutes)  
3. Click **“Add Time”** — or press **Enter**  
4. Edit or delete entries as needed  
5. Watch your total time update in real time  
6. Your data is automatically saved even if you close the browser!

## Installation (Local Development) ⚙️

To run locally:

```bash
git clone https://github.com/homayunmmdy/time-calculator.git
cd time-calculator
open index.html
```

> Works in any modern browser. No build step required!

## Contributing 🤝

Contributions are welcome! If you have ideas for improvements, please:
1. Fork the project  
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your changes (`git commit -m 'Add some amazing feature'`)  
4. Push to the branch (`git push origin feature/AmazingFeature`)  
5. Open a pull request  