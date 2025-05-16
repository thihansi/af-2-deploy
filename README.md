[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)

# World Explorer – A Fun and Educational Geography App for Kids

## Project Overview

World Explorer is a fun and interactive web app made especially for kids who are curious about the world. It helps users discover countries, learn cool facts about different cultures, see colorful flags, and even test their knowledge with exciting quizzes. With its bright design and easy-to-use features, World Explorer makes learning geography feel like an adventure around the globe!

## Features

- Interactive immersive globe visualization with 3D rotation and zoom
- Detailed country information pages with flags and data
- Continent-based country exploration and filtering
- Country statistics and data comparisons
- Interactive geography quiz with scoring system
- User authentication with JWT
- Personal quiz results tracking and history
- Modern UI with smooth animations

## Technology Stack

### Frontend

- React 19 with Vite
- React Router DOM for navigation
- Tailwind CSS for styling
- Axios for API requests
- React Globe.gl for 3D globe
- Framer Motion for animations
- Three.js for 3D rendering

### Backend

- Node.js runtime
- Express.js framework
- MongoDB with Mongoose ODM
- JWT for authentication
- Cookie Parser for handling cookies
- CORS for cross-origin requests

## API Integration

This project uses the [REST Countries API](https://restcountries.com) to fetch:

- Country details and demographics
- National flags and symbols
- Population statistics
- Geographic coordinates and regions
- Languages and currencies

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance
- Git

### Installation & Setup

1. Clone the repository:

```sh
git clone https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-thihansi.git
cd af-2-thihansi
```

2. Install Frontend Dependencies:

```sh
cd frontend
npm install
```

3. Install Backend Dependencies:

```sh
cd backend
npm install
```

### Environment Setup

1. Frontend Configuration (.env):

```sh
VITE_API_URL=http://localhost:9000
VITE_APP_NAME=World Explorer
```

2. Backend Configuration (.env):

```sh
PORT=9000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

### Running the Application

1. Start MongoDB (if running locally):

```sh
mongod
```

2. Start Backend Server:

```sh
cd backend
npm run dev
```

3. Start Frontend Development Server:

```sh
cd frontend
npm run dev
```

### Building for Production

1. Build Frontend:

```sh
cd frontend
npm run build
```

2. Build Backend:

```sh
cd backend
npm run build
```

## Demo Links

- Frontend App: https://af-2-deploy.onrender.com
- Backend API: https://world-explorer-pytx4lrk3-thihansi-gunawardenas-projects.vercel.app

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- [REST Countries API](https://restcountries.com) for country data
- React Globe.gl for 3D visualization
- Tailwind CSS for styling system