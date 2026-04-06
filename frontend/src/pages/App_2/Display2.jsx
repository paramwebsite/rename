import React, { useEffect, useMemo, useState } from "react";
import { getWS, sendJSON } from "../../utils/ws";
import NameLayout12 from "./layouts/NameLayout12";
import NameLayout11 from "./layouts/NameLayout11";
import NameLayout10 from "./layouts/NameLayout10";
import NameLayout9 from "./layouts/NameLayout9";
import NameLayout8 from "./layouts/NameLayout8";
import "./Display2.css";
import NameLayout7 from "./layouts/NameLayout7";
import NameLayout6 from "./layouts/NameLayout6";
import NameLayout5 from "./layouts/NameLayout5";
import NameLayout4 from "./layouts/NameLayout4";
import NameLayout3 from "./layouts/NameLayout3";
import NameLayout2 from "./layouts/NameLayout2";
import InputScreen from "./InputScreen";
const displayId = 2;

const Display2 = () => {
  const ws = useMemo(() => getWS(), []);
  const [name, setName] = useState("");
  const layouts = {
    12: NameLayout12,
    11: NameLayout11,
    10: NameLayout10,
    9: NameLayout9,
    8: NameLayout8,
    7:NameLayout7,
    6:NameLayout6,
    5:NameLayout5,
    4:NameLayout4,
    3:NameLayout3,
    2:NameLayout2
  };

  useEffect(() => {
    const onOpen = () => {
      sendJSON(ws, { type: "registerDisplay", displayId });
    };

    const onMessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }

      if (msg.type === "newName") {
        setName(msg.name.replace(/\s/g, ""));
      }

      if (msg.type === "resetDisplay") {
        setName("");
      }
    };

    if (ws.readyState === WebSocket.OPEN) onOpen();
    else ws.addEventListener("open", onOpen);

    ws.addEventListener("message", onMessage);

    return () => {
      ws.removeEventListener("open", onOpen);
      ws.removeEventListener("message", onMessage);
    };
  }, [ws]);

  
  // const renderLayout = () => {
  //   if (!name) return null;

  //   const Layout = layouts[name.length];

  //   return Layout ? (
  //     <Layout name={name} />
  //   ) : (
  //     <div style={{ color: "black", fontSize: 40 }}>
  //       Length {name.length} not supported yet
  //     </div>
  //   );
  // };

  const renderLayout = () => {
  if (!name) return <InputScreen />;

  const Layout = layouts[name.length];

  return Layout ? (
    <Layout name={name} />
  ) : (
    <div style={{ color: "black", fontSize: 40 }}>
      Length {name.length} not supported yet
    </div>
  );
};


  return (
    <div
      style={{ width: "100vw", height: "100vh", background: "white" }}
      className="display2"
    >
      {renderLayout()}
    </div>
  );
};

export default Display2;
