# Random Joke Generator

## Overview

This is a web application that fetches and displays random jokes based on user-selected categories. The application uses the Official Joke API to fetch jokes and includes the following features:

- *Category Selection*: Choose between "Programming" and "Dad Jokes."
- *Joke Display*: View the joke setup and punchline.
- *Favorites*: Add jokes to a favorites list.
- *Rating System*: Rate jokes with a 1 to 5-star rating system.
- *Speech*: Listen to the joke read aloud using the Web Speech API.

## Features

- Category Selection: A dropdown menu allows you to select joke categories.
- Joke Display: Shows the joke setup and punchline.
- Favorites: Toggle jokes in the favorites list.
- Rating System: Rate jokes from 1 to 5 stars.
- Speech: Button to listen to the joke read aloud.

## Technologies Used

- React: Front-end library for building the user interface.
- TypeScript: Provides type safety and better development experience.
- Tailwind CSS: For styling and layout.
- Official Joke API: To fetch jokes based on the selected category.
- Web Speech API: To read jokes aloud.

## Installation

1. Clone the repository:
https://github.com/Alishba-Moin/30-Days_Of_30-Projects/edit/master/random-jokes-generator/

2. Navigate to the project directory:
cd <project-directory>

3. Install dependencies:
npm install

4. Run the application:
npm run dev

5. Open your browser and visit:
http://localhost:3000

USAGE:

Select a Joke Category:
- Choose between "Programming" and "Dad Jokes" from the dropdown menu.

Fetch a Joke:
- Click the "😂 Get New Joke 😂" button to fetch a random joke from the selected category.
Add to Favorites:
- Click the heart icon to add the current joke to your favorites list. The icon toggles between filled and empty heart based on the joke's favorite status.

Rate the Joke:
- Rate the joke from 1 to 5 stars using the star icons.
  
Listen to the Joke:
- Click the "🔊 Listen to Joke 🔊" button to hear the joke read aloud.
View Favorites:
-Favorite jokes are displayed below the joke card.
