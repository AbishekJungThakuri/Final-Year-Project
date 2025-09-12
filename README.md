# HolidayNepal Frontend

HolidayNepal is a web-based AI trip planner designed to simplify and enhance travel planning within Nepal.  
This repository contains the frontend application, built with **React.js** and **Tailwind CSS**, providing users with an interactive interface to:

- Browse destinations and attractions  
- Customize and manage itineraries  
- Interact with an AI-powered trip planner in real time  

Note: The frontend depends on the backend services. Please clone and run the [HolidayNepal Backend](https://github.com/SudarshanPoudel/Holiday_Nepal_Backend) before starting this project, otherwise the app will not function properly.  

---

## Tech Stack

- **React.js** – Frontend framework  
- **Tailwind CSS** – Utility-first responsive styling  
- **Axios** – API communication with backend  
- **Redux** – State management for predictable app flow  

---

## Features

### User Features
- **User Authentication**: Register and log in with JWT-based authentication (access and refresh tokens for secure, persistent sessions).  
- **Trip Planning with AI**: Connects to backend WebSocket API during plan generation, showing real-time updates while itineraries are built.  
- **Dynamic Itinerary Management**: Add, remove, or edit trip steps, synced instantly with backend updates.  
- **Plan Sharing**: Share itineraries with others, duplicate (remix) existing plans, and explore community-shared trips.  
- **Privacy Controls**: Make plans public or private.  
- **Profile Management**: Update personal details, change travel preferences, and set common prompts to guide AI planning across trips.  
- **Save and Bookmark**: Save generated plans for later reference, bookmark favorite trips.  
- **Rating System**: Rate itineraries for quality and usefulness.  
- **Map Integration**: Interactive maps powered by **OpenStreetMap (OSM)** to visualize routes, destinations, and activities.  

### Admin Panel
- Add, update, or remove **places**, **activities**, **routes**, **transport services**, and **hotel services**.  
- Manage user-generated content and monitor platform activity.  

---

## Screenshots

![image](./screenshots/ss-1.png)

---

![image](./screenshots/ss-2.png)

---

![image](./screenshots/ss-3.png)

---

![image](./screenshots/ss-4.png)

---

![image](./screenshots/ss-5.png)

---

![image](./screenshots/ss-6.png)

---

![image](./screenshots/ss-7.png)

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/SudarshanPoudel/Holiday_Nepal_Frontend.git
cd Holiday_Nepal_Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the backend (required)

Clone and run the backend first:
[HolidayNepal Backend](https://github.com/SudarshanPoudel/Holiday_Nepal_Backend)

### 4. Run the frontend

```bash
npm run dev
```

The app will be available at:
[http://localhost:5173](http://localhost:5173)


---

## Related Repositories

* [HolidayNepal Backend](https://github.com/SudarshanPoudel/Holiday_Nepal_Backend)