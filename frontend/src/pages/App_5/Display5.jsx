import { useEffect, useMemo, useState } from "react";
import { SlotDigit } from "./Slotdigit";
import slotFrame from "./assests/slot_machine.svg";
import { getWS, sendJSON } from "../../utils/ws";

const displayId = 5;

export default function Display5() {
  const ws = useMemo(() => getWS(), []);
  const [name, setName] = useState("abhishek");
  const [count, setCount] = useState(0);

  const [spinId, setSpinId] = useState(0);
  const [digits, setDigits] = useState(["0", "0", "0"]);

  useEffect(() => {
    if (count === null || count === undefined) return;

    const str = String(count).padStart(3, "0").slice(-3);
    setDigits(str.split(""));
    setSpinId((id) => id + 1);
  }, [count]);

  // ---------------------------------Web socket part start ---------------------------

  useEffect(() => {
    const onOpen = () => {
      // register this display
      sendJSON(ws, { type: "registerDisplay", displayId });
    };

    const onMessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
        console.log(msg);
      } catch {
        return;
      }

      // if (msg.type === "newName") {
      //   console.log("Received:", msg);

      //   setName(msg.name);

      //   // ✅ ONLY update count if backend sent it
      //   if (typeof msg.count === "number") {
      //     console.log(msg.count);
      //     setCount(msg.count);
      //   }
      // }

      if (msg.type === "newName") {
        console.log("Received:", msg);

        setName(msg.name);

        const numericCount = Number(msg.count);
        console.log("numericCount:", numericCount, "type:", typeof msg.count);

        if (Number.isFinite(numericCount)) {
          setCount(numericCount);
        }
      }

      // if (msg.type === "resetDisplay") {
      //   setName("");
      // }
      if (msg.type === "resetDisplay") {
        setName("");
        setCount(0);
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

  // ---------------------------------Web socket part End---------------------------

  return (
    <div className=" w-screen h-screen    ">
      {/* strict 1:1 */}
      <div className="mx-auto relative aspect-square h-full  ">
        <img
          src={slotFrame}
          className="absolute inset-0 h-full w-full object-contain"
          alt="Slot Machine"
          draggable={false}
        />

        {/* NAME OVERLAY */}
        {name && (
          <div className="pointer-events-none absolute left-1/2 top-[85%] w-[90%] -translate-x-1/2 text-center">
            <div
              className={[
                // responsive font sizing
                "font-black  leading-[1.1] tracking-[1px] text-[#ffd700]",
                "text-[clamp(16px,4.2vw,44px)]",
                "[text-shadow:-3px_-3px_0_#8b0000,3px_-3px_0_#8b0000,-3px_3px_0_#8b0000,3px_3px_0_#8b0000,0_5px_0_#000]",
              ].join(" ")}
            >
              <span className="uppercase">{name}</span>
              {/* <sup
                className={[
                                  "text-[clamp(16px,4.2vw,44px)]",
                ].join(" ")}
              > */}
                's
              {/* </sup> */}
            </div>

            <div
              className={[
                "mt-1 font-extrabold uppercase tracking-[1px] text-[#ffd700]",
                "text-[clamp(10px,2.2vw,22px)]",
                "[text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000]",
              ].join(" ")}
            >
              HAVE VISITED WHITEFIELD
            </div>
          </div>
        )}

        {/* DIGITS AREA (all sizes relative to the square) */}
        <div className="pointer-events-none absolute left-0 top-[28%] h-[22%] w-full">
          {/* left */}
          <div className="absolute left-[24%] h-full w-[18%]">
            <SlotDigit trigger={spinId} finalDigit={digits[0]} />
          </div>

          {/* center */}
          <div className="absolute left-1/2 h-full w-[18%] -translate-x-1/2">
            <SlotDigit trigger={spinId} finalDigit={digits[1]} />
          </div>

          {/* right */}
          <div className="absolute right-[25%] h-full w-[18%]">
            <SlotDigit trigger={spinId} finalDigit={digits[2]} />
          </div>
        </div>
      </div>
    </div>
  );
}
