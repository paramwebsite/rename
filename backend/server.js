// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');
// const fs = require("fs");
// const { initDB } = require('./Database/db');

// const http = require('http');   // 👈 create HTTP server
// const { Server } = require('socket.io');

// const videoRoutes = require('./routes/videos')
// const displayRoutes = require('./routes/displays')
// const videoStreamRoutes = require('./routes/videoStream');
// const nameRouter = require('./routes/name')
// const getImageRouter = require('./routes/getImage');


// const PORT = 4000;

// const app = express();
// const server = http.createServer(app); // 👈 attach socket.io to this server
// const io = new Server(server, {
//   cors: {
//     origin: "*",  // allow all for now
//   },
// });

// app.use(cors());
// app.use(express.json());


// // simple logger
// app.use((req, res, next) => {
//   const now = new Date().toISOString();
//   console.log(`[${now}] ${req.method} ${req.url}`);
//   next();
// });





// io.on("connection", (socket) => {
//   console.log("Client connected:", socket.id);

//   // Each display registers itself with ID (from URL param or query)
//   socket.on("registerDisplay", (displayId) => {
//     console.log(`Display ${displayId} registered on socket ${socket.id}`);
//     socket.join(`display-${displayId}`); // join room for that display
//     socket.join("displays")
//   });


//   socket.on('RegisterDashboard',(dashboardId)=>{
//     console.log(`dashboardId: ${dashboardId} registered on socket ${socket.id}`);
//     socket.join(`dashboards`);
//   })


//   socket.on('NameInput',(data)=>{
//     const {nameText} = data;
//       socket.to("displays").emit("newName", {name:nameText});
//   })

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// // inject io into req for routers
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });




// // app.use("/video", videoStreamRoutes); 



// (async function start() {

//   try {
//     const db = await initDB();
//     app.locals.db = db; // make db available to routers

//     app.use("/videos", videoRoutes);
//     app.use("/displays", displayRoutes);
//     app.use("/video", videoStreamRoutes);
//     app.use("/name", nameRouter);
//     app.use("/image",getImageRouter)
//     app.use("/images", express.static(path.join(__dirname, "uploads")));

//     app.get("", (req, res) => res.send("Server running"));

//     server.listen(PORT, "0.0.0.0", () => console.log(`Server listening on http://localhost:${PORT}`));

//   } catch (err) {
//     console.error("Failed to start server:", err);
//     process.exit(1);
//   }

// })();

import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
// import dns from "dns";
// dns.setDefaultResultOrder("ipv4first");


// --- Core & tooling (ESM) ---
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// --- RFID stack (ESM) ---
import connectDB from "./db.js";                       // RFID DB (mongoose) connector
import healthRoute from "./routes/healthRoute.js"; // health route
import startEventWatcher from "./changeStream.js";     // RFID change stream -> emits socket events
import cardRoutes from "./routes/cardRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";

// namecount route for adding/counting names
import nameCountRouter from "./routes/nameCount.js";

// --- Application stack (CommonJS) ---
const { initDB } = require("./Database/db");           // your app DB (whatever you used)
// const videoRoutes     = require("./routes/videos");
const displayRoutes = require("./routes/displays");
// const videoStreamRoutes = require("./routes/videoStream");
const nameRouter = require("./routes/name");
const display11NameRouter = require("./routes/nameRoute.js");
// const getImageRouter  = require("./routes/getImage");

// -----------------------------------
// Boot
// -----------------------------------
const PORT = process.env.PORT || 3000;

async function start() {
  // 1) Connect databases
  //    - connectDB(): RFID (mongoose)
  //    - initDB():    Application DB (returns a connection/handle)
  connectDB();
  const appDb = await initDB();

  // 2) Express base
  const app = express();
  const server = http.createServer(app);
  // const io = new Server(server, { cors: { origin: "*" } });
  const wss = new WebSocketServer({ server });

  // ---- WebSocket client tracking ----
  const displays = new Map();   // displayId -> ws
  const dashboards = new Set(); // ws set (optional)
  const touchDesigners = new Set(); // optional if you want to track TD

  function send(ws, data) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  function broadcastToDisplays(data) {
    for (const ws of displays.values()) {
      send(ws, data);
    }
  }

  // 3) Middlewares
  app.use(cors());
  app.use(express.json());

  // simple logger (from your app server)
  // app.use((req, res, next) => {
  //   const now = new Date().toISOString();
  //   console.log(`[${now}] ${req.method} ${req.url}`);
  //   next();
  // });
  app.use((req, res, next) => {
    const now = new Date().toISOString();
    const ua = req.get("user-agent");
    const ref = req.get("referer");
    // console.log(
    //   `[${now}] ${req.method} ${req.url} :: ua="${ua}" ref="${ref}" ip=${req.ip}`
    // );
    console.log(`[${now}] ${req.method} ${req.url}`);
    next();
  });

  // make sockets & DB accessible to routers that expect them
  app.locals.db = appDb;
  app.use((req, _res, next) => {
    req.wss = wss;
    next();
  });

  // 4) Static assets
  // RFID used /uploads; app used /images pointing to uploads
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  app.use("/images", express.static(path.join(__dirname, "uploads")));

  // 5) RFID routes (unchanged paths)
  app.use("/card", cardRoutes);
  app.use("/events", eventRoutes);
  app.use("/visitors", visitorRoutes);

  // Name count route
  app.use("/namecount", nameRouter);

  // 6) Application routes (unchanged paths)
  // app.use("/videos",  videoRoutes);
  app.use("/displays", displayRoutes);
  // app.use("/video",    videoStreamRoutes);
  app.use("/name", nameRouter);
  // app.use("/image",    getImageRouter);

  app.use('/display11/name', display11NameRouter);

  // 6.1) Health route
  app.use("/health", healthRoute);
  app.get("/", (_req, res) => res.send("Unified server running"));

  // 7) Socket.IO events
  // io.on("connection", (socket) => {
  //   console.log("🟢 Client connected:", socket.id);

  //   // Display registration
  //   socket.on("registerDisplay", (displayId) => {
  //     console.log(`🖥️ Display ${displayId} registered on socket ${socket.id}`);
  //     socket.join(`display-${displayId}`);
  //     socket.join("displays");
  //   });

  //   // Dashboard registration
  //   socket.on("RegisterDashboard", (dashboardId) => {
  //     console.log(`📊 Dashboard ${dashboardId} registered on ${socket.id}`);
  //     socket.join("dashboards");
  //   });

  //   // Name coming from TouchDesigner
  //   socket.on("NameInput", (data) => {

  //     console.log(data)

  //     const { nameText } = data || {};

  //     console.log("📥 Name received from TouchDesigner:", nameText);

  //     if (!nameText) {
  //       console.log("⚠️ Warning: NameInput received but nameText missing");
  //       return;
  //     }

  //     // Send the name to all displays
  //     io.to("displays").emit("newName", { name: nameText });

  //     console.log("📤 Sent to displays:", nameText);
  //   });

  //   // Clear all displays
  //   socket.on("ClearDisplays", () => {
  //     console.log("🧹 ClearDisplays triggered");
  //     io.to("displays").emit("resetDisplay");
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("🔴 Client disconnected:", socket.id);
  //   });
  // });
  wss.on("connection", (ws, req) => {

    const ip = req.socket.remoteAddress;
    const url = req.url;

    console.log("🟢 WS client connected");
    console.log(`   from IP: ${ip}`);
    console.log(`   URL: ${url}`);


    ws.meta = { role: null, displayId: null };

    ws.on("message", (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }

      // 1️⃣ Register display
      if (msg.type === "registerDisplay") {
        ws.meta.role = "display";
        ws.meta.displayId = msg.displayId;

        displays.set(msg.displayId, ws);

        console.log(`🖥️ Display ${msg.displayId} registered`);
        return;
      }

      // 2️⃣ Register dashboard
      if (msg.type === "registerDashboard") {
        ws.meta.role = "dashboard";
        dashboards.add(ws);
        console.log("📊 Dashboard registered");
        return;
      }

      //register touchdesigner
      if (msg.type === "registerTouchDesigner") {
        ws.meta.role = "touchdesigner";
        touchDesigners.add(ws);
        console.log("🎛️ TouchDesigner registered");
        return;
      }

      // 3️⃣ Name input from TouchDesigner
      if (msg.type === "NameInput") {
        const nameText = msg.nameText;

        console.log("📥 Name from TouchDesigner:", nameText);

        if (!nameText) return;

        broadcastToDisplays({
          type: "newName",
          name: nameText,
        });

        console.log("📤 Broadcasted to displays:", nameText);
        return;
      }



      // 4️⃣ Clear displays
      if (msg.type === "ClearDisplays") {
        broadcastToDisplays({ type: "resetDisplay" });
        console.log("🧹 Displays cleared");
      }
    });

    ws.on("close", () => {
      if (ws.meta.role === "display") {
        displays.delete(ws.meta.displayId);
        console.log(`🔴 Display ${ws.meta.displayId} disconnected`);
      }
      if (ws.meta.role === "dashboard") dashboards.delete(ws)
      if (ws.meta.role === "touchdesigner") touchDesigners.delete(ws);;
    });
  });

  // Log WS status every 10 seconds
  setInterval(() => {
    console.log(
      "📡 WS status →",
      "displays:", displays.size,
      "dashboards:", dashboards.size,
      "touchdesigners:", touchDesigners.size
    );
  }, 60000);

  // 8) Start the RFID change-stream watcher
  // This should keep emitting `card-detected` / `card-lifted` to all sockets
  startEventWatcher(wss);

  // 9) Listen
  server.listen(PORT, "0.0.0.0", () =>
    console.log(`🚀 Unified server listening on http://localhost:${PORT}`)
  );
}

start().catch((err) => {
  console.error("Failed to start unified server:", err);
  process.exit(1);
});

