# RFID Interactive System – Full Stack Application

This repository contains a **full‑stack interactive system** built using **Node.js (backend)**, **React.js (frontend)**, and **MongoDB**, designed for **RFID‑driven interactive installations**. The system is used in gallery / exhibit / kiosk‑based environments where reading an RFID card triggers multiple applications (displays) simultaneously, while all interactions are logged in a database in real time.

An additional folder, **`nsfwfilter`**, contains logic for filtering and validating user‑entered text before it is processed or displayed.

---

## ✨ Core Concept

* An **RFID card** is scanned
* The system authenticates the RFID against the database
* A **name is entered once** (via dashboard or input UI)
* The name is **broadcast in real time** to multiple display applications
* Each display processes the name independently and generates its own output
* All interactions (RFID read, removal, name entry, events) are **persisted in MongoDB**

This architecture is ideal for **multi‑screen installations**, **interactive museums**, and **real‑time generative exhibits**.

---

## 🧱 Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* WebSockets (real‑time communication)

### Frontend

* React.js
* Vite
* WebSocket client

### Other

* RFID simulation dashboard
* NSFW / input validation filter

---

## 📁 Repository Structure

```
root/
├── backend/
│   ├── database/
│   ├── models/
│   │   ├── card.js
│   │   ├── event.js
│   │   └── visitor.js
│   ├── routes/
│   │   ├── names.js
│   │   ├── displays.js
│   │   ├── card.js
│   │   ├── event.js
│   │   └── visitor.js
│   ├── changestream.js
│   ├── db.js
│   ├── server.js
│   ├── .env
│   └── .gitignore
│
├── frontend/
│   ├── .env
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       │   ├── display1.jsx
│       │   ├── display2.jsx
│       │   ├── ...
│       │   └── display12.jsx
│       ├── utils/
│       │   ├── websocket.js
│       │   ├── config.js
│       │   └── auth.js
│       ├── App.jsx
│       ├── main.jsx
│       └── index.jsx
│
├── nsfwfilter/
│   └── (text validation & filtering logic)
│
└── README.md
```

---

## 🔧 Backend Overview

### 1. Database Models (`backend/models`)

* **card.js**
  Stores RFID card information and authentication state

* **visitor.js**
  Stores user‑specific data associated with an RFID

* **event.js**
  Logs every interaction (RFID read, name submission, removal, display triggers)

MongoDB is used as the primary datastore.

---

### 2. Routes (`backend/routes`)

* **names.js**
  Receives the name entered from the frontend and propagates it to all display applications

* **displays.js**
  Handles display‑specific logic and endpoints

* **card.js**
  CRUD and authentication logic for RFID cards

* **visitor.js**
  Visitor data handling

* **event.js**
  Event logging and retrieval

---

### 3. Real‑Time Updates

#### `changestream.js`

* Watches MongoDB collections using **MongoDB Change Streams**
* Reports live database updates
* Used to sync real‑time state across the system

#### `server.js`

* Main backend entry point
* Handles:

  * WebSocket connections
  * RFID/name broadcast events
  * Logging connections from **TouchDesigner** and frontend displays
  * Initializing `changestream.js`

#### `db.js`

* MongoDB connection setup using environment variables

---

## 🎨 Frontend Overview

### Pages (`frontend/src/pages`)

* Contains **12 independent applications**
* Each application is a standalone display
* Files are named:

  * `display1.jsx`
  * `display2.jsx`
  * ...
  * `display12.jsx`

Each display:

* Listens to WebSocket updates
* Receives the broadcasted name
* Starts its own processing / visual logic

---

### Utilities (`frontend/src/utils`)

* **websocket.js**
  WebSocket connection handler

* **config.js**
  Stores `WS_URL`, `SERVER_URL`, and environment configs

* **auth.js**
  Validates whether the entered RFID/card number is authenticated in the database

---

### Entry Files

* **main.jsx** – React bootstrap
* **App.jsx** – Routing and global structure
* **index.jsx** – DOM entry point

---

## 🖥️ Display Applications Mapping

The system consists of **12 independent display applications**, each listening to the same WebSocket broadcast but processing the data differently. The table below maps each display number to its associated application.

> ⚠️ Update the **Application Purpose** column as per your actual implementation.

| Display No. | File Name     | Application / Purpose Description  |
| ----------- | ------------- | ---------------------------------- |
| Display 1   | display1.jsx  | Primary generative visual output   |
| Display 2   | display2.jsx  | Alternate visual interpretation    |
| Display 3   | display3.jsx  | Text-based transformation view     |
| Display 4   | display4.jsx  | Symbolic / coded name rendering    |
| Display 5   | display5.jsx  | Data-driven graphic output         |
| Display 6   | display6.jsx  | Experimental visual logic          |
| Display 7   | display7.jsx  | Audio-reactive / signal-based view |
| Display 8   | display8.jsx  | Language / typography exploration  |
| Display 9   | display9.jsx  | Cultural / semantic mapping view   |
| Display 10  | display10.jsx | Minimal / abstract representation  |
| Display 11  | display11.jsx | System feedback / meta display     |
| Display 12  | display12.jsx | Composite / summary visualization  |

Each display operates as an **independent application** while remaining synchronized through the backend broadcast layer.

---

## 🧪 Dashboard & RFID Simulation

The system includes a **dashboard page** that simulates RFID behavior:

### Dashboard Features

* Manually enter an RFID number
* Validate RFID against the database
* Enter a visitor name (only after authentication)
* Submit the name

### What Happens on Submit

1. RFID authentication is checked
2. Name is saved in the database
3. An **event entry** is created in the `events` collection
4. The name is **broadcast via WebSocket**
5. All display applications receive the name
6. Each display begins its own processing and output generation

---

## 🔐 NSFW Filter (`nsfwfilter` folder)

This folder contains logic for:

* Validating user‑entered text
* Filtering inappropriate or invalid inputs
* Ensuring safe, controlled display across public installations

The filter can be plugged into:

* Name submission flow
* Dashboard input
* Any text‑based interaction

---

## 🚀 How to Run the Project

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=your_backend_port
```

Start the backend:

```bash
npm run dev
# or
node server.js
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Update frontend `.env` with:

```env
VITE_SERVER_URL=http://localhost:PORT
VITE_WS_URL=ws://localhost:PORT
```

---

### 3. MongoDB

Ensure MongoDB is running locally or via a cloud service (Atlas).

---

## 📡 Real‑Time Flow Summary

```
RFID Read / Simulated
        ↓
Card Authentication
        ↓
Name Entry
        ↓
Event Logged in DB
        ↓
WebSocket Broadcast
        ↓
12 Display Apps Triggered
        ↓
Independent Visual Outputs
```

---

## 🎯 Use Cases

* Interactive museum installations
* Multi‑screen exhibits
* RFID‑based visitor experiences
* Real‑time generative displays
* TouchDesigner + Web application pipelines

---

## 🛠 Future Extensions

* Analytics dashboard for event history
* Admin UI for card management
* Multi‑language support
* Sound / media synchronization
* Hardware RFID reader integration

---

## 📄 License

This project is intended for experimental, educational, and installation‑based use. Add a license as required.

---

## 🙌 Acknowledgements

Built for real‑time, spatial, and interactive storytelling environments where **a single human action reshapes multiple digital realities at once**.
