🌤️ Weather Widget App

Welcome to the Weather Widget App! This is a sleek, easy-to-use application that lets you check the current weather by city. Built with Next.js, React, Tailwind CSS, and Shadcn UI components, it’s designed to be both functional and stylish.

 🚀 Features

- **Search by City**: Enter any city to get current weather details.
- **Real-time Data**: Fetches and displays live weather information.
- **Responsive Design**: Looks great on all devices.

 🔧 Tech Stack

- **Next.js**: For building a high-performance React application.
- **React**: For creating dynamic user interfaces.
- **Tailwind CSS**: For modern, utility-first styling.
- **Shadcn UI**: Pre-styled, reusable UI components.
- **WeatherAPI**: Provides accurate weather data.
- **Vercel**: For seamless deployment.

 🛠️ Getting Started

Prerequisites

- Node.js 
- npm or yarn

 Setup

1. **Clone the Repository**:

   git clone https://github.com/Alishba-Moin/30-Days_Of_30-Projects.git

2. **Navigate to the Project Directory**:

   cd weather-widget-app

3. **Install Dependencies**:

   npm install


4. **Add Your WeatherAPI Key**:

   Get your API key from [WeatherAPI](https://www.weatherapi.com/) and add it to `.env.local`:

   NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here

5. **Run the Development Server**:

   npm run dev

   Visit `http://localhost:3000` to see the app in action.

Build for Production

When you’re ready to deploy, create a production build:

npm run build


🧩 How It Works

- **State Management**: Uses React hooks for handling state (location, weather data, errors, and loading).
- **API Integration**: Fetches weather data from WeatherAPI and updates the UI based on the response.

 🌐 Deployment

Deploy your app with [Vercel](https://vercel.com/). Connect your repository, and Vercel will handle the rest.

 📝 License

MIT License. Feel free to use and modify!
