import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import FamousCard from "./components/FamousCard";
import VariantsCloud from "./components/VariantsCloud";
import TrendChart from "./components/TrendChart";
import { getWS, sendJSON } from "../../utils/ws";
import { API_URL } from "../../utils/config";

const displayId = 11;

export default function Display11() {
  const [name, setName] = useState("");
  const [data, setData] = useState(null);
  const [show,setShow] = useState(false);

  const ws = useMemo(() => getWS(), []);

  useEffect(() => {
    const onOpen = () => {
      // register this display
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
        console.log("Received new name:", msg.name);
        setName(msg.name);
        handleSearch(msg.name);
      }

      if (msg.type === "resetDisplay") {
        setName("");
        setShow(false);
      }
    };

    if (ws.readyState === WebSocket.OPEN) onOpen();
    else ws.addEventListener("open", onOpen);

    ws.addEventListener("message", onMessage);

    return () => {
      ws.removeEventListener("open", onOpen);
      ws.removeEventListener("message", onMessage);
      // ⚠️ don't ws.close() because ws is a shared singleton (like your old getSocket)
    };
  }, [ws]);

  const handleSearch = async (name) => {
    // const res = await axios.get(`/api/name/${encodeURIComponent(name)}`);
    // http://localhost:5000/api/name/abhishek
    // console.log(`${API_URL}/display11/name/${name}`);
    const res = await axios.get(`${API_URL}/display11/name/${name}`);
    console.log(res.data);
    setData(res.data);
    setShow(true);
  };

  return (
    <div className="min-h-screen bg-black text-[#E6FF00] flex justify-center ">
      {/* 3:5 container */}

      {show ? (
        <div
          className="w-[600px] h-[1030px] border-4 border-[#E6FF00] p-6 pl-0 relative overflow-hidden bg-contain bg-right bg-no-repeat vt323 "
          style={{ backgroundImage: "url(src/pages/App_11/assets/bg.png)" }}
        >
          {/* <div className="mb-6 flex gap-2 pl-6">
            <input
              className="bg-black border border-[#E6FF00] px-3 py-2 w-full text-[#E6FF00] outline-none"
              placeholder="Enter name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-[#E6FF00] text-black px-4 font-bold"
            >
              Run
            </button>
          </div> */}

          <div className=" flex flex-col  mt-10">
            {data && (
              <>
                <div className=" ">
                  <TrendChart data={data.trends} />
                </div>
                <div className="pl-10  ">
                  <FamousCard person={data.famousPerson} />
                </div>
                <div className="pl-10  ">
                  <VariantsCloud variants={data.variants} />
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div
          className="w-[600px] h-[1030px]  p-6 pl-0 relative overflow-hidden  vt323 "
          style={{ backgroundImage: "url(src/pages/App_11/assets/glitch.gif)" }}
        ></div>
      )}
    </div>
  );
}
