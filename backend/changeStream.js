// import Event from "./models/event.js";
// import Visitor from "./models/visitor.js";

// const startEventWatcher = (wss) => {
//   const changeStream = Event.watch();

//   changeStream.on("change", async (change) => {
//     if (change.operationType === "insert") {
//       const event = change.fullDocument;
//       const { UID, stationId, eventType } = event;

//       console.log("📡 New Event:", event);

//       // Fetch visitor data
//       const visitor = await Visitor.findOne({ UID });
//       const appInfo = visitor?.appData?.[stationId] || {};

//       // Emit event for cardDetected
//       if (eventType === "cardDetected") {
//         io.emit("card-detected", {
//           UID,
//           stationId,
//           visitorData: { name: appInfo.name, img_address: appInfo.img_address, off: appInfo.off }
//         });
//       }

//       // Handle cardLifted
//       if (eventType === "cardLifted") {
//         // Update visitor's appData off status
//         await Visitor.updateOne(
//           { UID },
//           { $set: { [`appData.${stationId}.off`]: true } }
//         );

//         // Fetch updated visitor data
//         const updatedVisitor = await Visitor.findOne({ UID });
//         const updatedAppInfo = updatedVisitor?.appData?.[stationId] || {};

//         // Emit event with updated visitor data
//         io.emit("card-lifted", {
//           UID,
//           stationId,
//           visitorData: { 
//             name: updatedAppInfo.name, 
//             img_address: updatedAppInfo.img_address, 
//             off: updatedAppInfo.off 
//           }
//         });

//         console.log("✅ Visitor updated:", updatedVisitor);
//       }
//     }
//   });
// };

// export default startEventWatcher;
import Event from "./models/event.js";
import Visitor from "./models/visitor.js";

const startEventWatcher = (wss) => {
  const changeStream = Event.watch();

  const broadcast = (payload) => {
    const msg = JSON.stringify(payload);

    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(msg);
      }
    });
  };

  changeStream.on("change", async (change) => {
    if (change.operationType !== "insert") return;

    const event = change.fullDocument;
    const { UID, stationId, eventType } = event;

    console.log("📡 New Event:", event);

    // Fetch visitor data
    const visitor = await Visitor.findOne({ UID });
    const appInfo = visitor?.appData?.[stationId] || {};

    // Emit event for cardDetected
    if (eventType === "cardDetected") {
      broadcast({
        type: "card-detected",
        UID,
        stationId,
        visitorData: {
          name: appInfo.name,
          img_address: appInfo.img_address,
          off: appInfo.off,
        },
      });
    }

    // Handle cardLifted
    if (eventType === "cardLifted") {
      // Update visitor's appData off status
      await Visitor.updateOne(
        { UID },
        { $set: { [`appData.${stationId}.off`]: true } }
      );

      // Fetch updated visitor data
      const updatedVisitor = await Visitor.findOne({ UID });
      const updatedAppInfo = updatedVisitor?.appData?.[stationId] || {};

      broadcast({
        type: "card-lifted",
        UID,
        stationId,
        visitorData: {
          name: updatedAppInfo.name,
          img_address: updatedAppInfo.img_address,
          off: updatedAppInfo.off,
        },
      });

      console.log("✅ Visitor updated:", updatedVisitor);
    }
  });
};

export default startEventWatcher;
