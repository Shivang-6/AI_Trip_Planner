# 🧭 AI Trip Planner

An intelligent travel planning web application that helps users effortlessly create personalized itineraries using AI.

## ✨ Overview

Planning a trip can be overwhelming — from finding attractions to optimizing your time. **AI Trip Planner** solves this by generating custom travel itineraries based on user input such as destination, duration, and interests. With a clean user interface and AI-powered backend, the app simplifies the entire process of planning a trip.

## 🧠 Problem It Solves

- Manual trip planning is time-consuming and inefficient.
- Users often don't know where to start when researching destinations.
- Balancing time, interests, and locations is difficult without local knowledge.
- Existing tools require jumping between multiple apps (maps, blogs, guides).

**This project provides an all-in-one smart solution** that leverages AI to create personalized, efficient, and enjoyable travel itineraries.

---

## 🛠️ Tech Stack

### 🔙 Backend (Node.js)
- **Node.js + Express**: Handles API requests and routes.
- **OpenAI or GROQ API**: Powers the itinerary generation with natural language understanding.
- **Modular Structure**: Controllers, services, and routes organized for scalability.

### 🌐 Frontend (React)
- **React**: For building a responsive user interface.
- **React Router**: For navigation between views.
- **Custom CSS**: For minimalist and clean styling.

### 📡 API Communication
- Frontend communicates with the backend via REST API to request and receive AI-generated itineraries.
- Get your GROQ-SDK AI KEY and store it in .env 
---

## 🚀 Features

- User inputs destination, travel duration, and interests.
- AI generates a day-by-day itinerary with recommendations.
- Easy-to-use and minimal UI.
- Fast and personalized results.

---

## 📂 Project Structure

/backend
├── src
│ ├── controllers
│ ├── routes
│ ├── services
│ ├── app.js
│ └── server.js
/frontend
├── public/
├── src/
│ ├── components/
│ ├── pages/
│ └── App.js



---

## 🧪 Setup Instructions

1. **Clone the repository:**

```bash
git clone https://github.com/Shivang-6/AI_Trip_planner
cd ai-trip-planner

Setup backend:
cd backend
npm install cors axios dotenv express groq-sdk
# Add your API key in src/services/groqService.js or equivalent
node src/server.js


Setup frontend:
cd frontend
npm install react react-dom react-router-dom 
npm start


Built with passion to make travel planning effortless.
