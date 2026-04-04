// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   Suspense,
//   useTransition,
//   useMemo,
// } from "react";
// import { feature } from "topojson-client";
// import WorldMap from "./components/WorldMap";
// import NameInput from "./components/NameInput";
// import { fetchNamePopularity } from "./services/geminiService";
// import { CountryPopularity, OriginData } from "./types";
// import { TOPO_JSON_URL } from "./constants";
// import { getWS, sendJSON } from "../../utils/ws";

// const displayId = 3;

// const Display3: React.FC = () => {
//   const [activeName, setActiveName] = useState<string>("");
//   const [popularityData, setPopularityData] = useState<CountryPopularity[]>([]);
//   const [originData, setOriginData] = useState<OriginData | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [geoData, setGeoData] = useState<any>(null);
//   const [indiaGeoData, setIndiaGeoData] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isPending, startTransition] = useTransition();
//   const [hasSearched, setHasSearched] = useState<boolean>(false);

//   // ----------------------Web socket Part start--------------------
//   const ws = useMemo(() => getWS(), []);
//   const [name, setName] = useState("");

//   useEffect(() => {
//     const onOpen = () => {
//       // register this display
//       sendJSON(ws, { type: "registerDisplay", displayId });
//     };

//     const onMessage = (event: any) => {
//       let msg;
//       try {
//         msg = JSON.parse(event.data);
//       } catch {
//         return;
//       }

//       if (msg.type === "newName") {
//         console.log("Received new name:", msg.name);
//         setName(msg.name);
//         handleSubmit(msg.name);
//       }

//       if (msg.type === "resetDisplay") {
//         setName("");
//       }
//     };

//     if (ws.readyState === WebSocket.OPEN) onOpen();
//     else ws.addEventListener("open", onOpen);

//     ws.addEventListener("message", onMessage);

//     return () => {
//       ws.removeEventListener("open", onOpen);
//       ws.removeEventListener("message", onMessage);
//       // ⚠️ don't ws.close() because ws is a shared singleton (like your old getSocket)
//     };
//   }, [ws]);

//   const handleSubmit = (value: string) => {
//     if (value.trim() && !isLoading) {
//       handleSearch(value);
//     }
//   };

//   // ----------------------Web socket Part End--------------------

//   useEffect(() => {
//     Promise.all([
//       fetch(TOPO_JSON_URL).then((res) => res.json()),
//       fetch("App_3/maps/india.topo.json").then((res) => res.json()),
//     ])
//       .then(([worldTopo, indiaTopo]) => {
//         const worldFeatures = feature(
//           worldTopo,
//           worldTopo.objects.countries as any,
//         );

//         const indiaFeatures = feature(
//           indiaTopo,
//           indiaTopo.objects.india as any,
//         );

//         startTransition(() => {
//           setGeoData(worldFeatures);
//           setIndiaGeoData(indiaFeatures);
//         });
//       })
//       .catch((err) => {
//         console.error("Failed to load map data", err);
//         setError("Failed to load map artifacts.");
//       });
//   }, []);

//   const handleSearch = useCallback((name: string) => {
//     startTransition(() => {
//       setActiveName(name);
//       setHasSearched(true);
//     });
//   }, []);

//   useEffect(() => {
//     if (!activeName) return;

//     const loadData = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const data = await fetchNamePopularity(activeName);
//         startTransition(() => {
//           setPopularityData(data.countries || []);
//           setOriginData(data.origin || null);
//         });
//       } catch (err) {
//         setError("The cartographer failed to find that data in the archives.");
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, [activeName]);

//   const mapLoading = isLoading || isPending;

//   return (
//     <main className="min-h-screen w-full flex flex-col items-center justify-center  bg-black text-[#5d4037] overflow-x-hidden font-imfell">
//       {name?(
//       <div className="w-full flex flex-col space-y-8 ">
//         <section className="w-full flex justify-center">
//           <Suspense
//             fallback={
//               <div className="h-96 flex items-center justify-center italic text-[#5d4037]">
//                 Restoring World Map...
//               </div>
//             }
//           >
//             {geoData ? (
//               <WorldMap
//                 popularityData={popularityData}
//                 originData={originData}
//                 isLoading={mapLoading}
//                 geoData={geoData}
//                 indiaGeoData={indiaGeoData}
//                 hasSearched={hasSearched}
//               />
//             ) : (
//               <div className="w-full aspect-[2/1] border-4 border-[#5d4037] bg-[#d9c5a0] flex items-center justify-center shadow-lg">
//                 <p className="animate-pulse text-[#5d4037] font-bold uppercase tracking-widest">
//                   Loading Map Archives...
//                 </p>
//               </div>
//             )}
//           </Suspense>
//         </section>

//         {error && (
//           <p className="text-center text-[#8a3b2e] font-bold py-2 bg-[#8a3b2e]/10 rounded border border-[#8a3b2e]/20 max-w-md mx-auto">
//             {error}
//           </p>
//         )}

//         {/* <section className="w-full flex justify-center pb-8">
//           <NameInput onSearch={handleSearch} isLoading={mapLoading} />
//         </section> */}
//       </div>
//       ):(
//       <div className=" relative w-full aspect-[2/1]   shadow-2xl overflow-hidden antique-texture"
//       style={{ backgroundImage: "url(src/assets/glitch.gif)" }}></div>
//       )}
//     </main>
//   );
// };

// export default Display3;
import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  useTransition,
  useMemo,
} from "react";
import { feature } from "topojson-client";
import WorldMap from "./components/WorldMap";
import NameInput from "./components/NameInput";
import { fetchNamePopularity } from "./services/geminiService";
import { CountryPopularity, OriginData } from "./types";
import { TOPO_JSON_URL } from "./constants";
import { getWS, sendJSON } from "../../utils/ws";

const displayId = 3;

// ── Zizian internal log messages ──────────────────────────────────────────────
const ZIZIAN_MESSAGES = {
  noOrigin:
    "Origin trace: No records filed. Identity origin: Unclassified. Possibly self-originating.",
  noData:
    "Archive query returned no entries. Specimen name exists outside documented records. Classification: Anomalous.",
  apiError:
    "Archive access interrupted. Data retrieval status: Failed. Reconnection attempt pending.",
  loading:
    "Cross-referencing universal name registry. Analysis in progress.",
};

// ── Helper ────────────────────────────────────────────────────────────────────
const ZizianLog = ({ message }: { message: string }) => (
  <p className="text-center italic tracking-widest text-[#5d4037] text-sm py-2">
    {message}
  </p>
);

// ── Component ─────────────────────────────────────────────────────────────────
const Display3: React.FC = () => {
  const [activeName, setActiveName] = useState<string>("");
  const [popularityData, setPopularityData] = useState<CountryPopularity[]>([]);
  const [originData, setOriginData] = useState<OriginData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [indiaGeoData, setIndiaGeoData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // ── Derived state for case handling ──────────────────────────────────────────
  const hasOrigin = !!originData;
  const hasCountries = popularityData.length > 0;
  const hasAnyData = hasOrigin || hasCountries;

  // ── WebSocket ─────────────────────────────────────────────────────────────────
  const ws = useMemo(() => getWS(), []);
  const [name, setName] = useState("");

  useEffect(() => {
    const onOpen = () => {
      sendJSON(ws, { type: "registerDisplay", displayId });
    };

    const onMessage = (event: any) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }

      if (msg.type === "newName") {
        console.log("Received new name:", msg.name);
        setName(msg.name);
        handleSubmit(msg.name);
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

  const handleSubmit = (value: string) => {
    if (value.trim() && !isLoading) {
      handleSearch(value);
    }
  };

  // ── Map data load ─────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch(TOPO_JSON_URL).then((res) => res.json()),
      fetch("App_3/maps/india.topo.json").then((res) => res.json()),
    ])
      .then(([worldTopo, indiaTopo]) => {
        const worldFeatures = feature(
          worldTopo,
          worldTopo.objects.countries as any
        );
        const indiaFeatures = feature(
          indiaTopo,
          indiaTopo.objects.india as any
        );
        startTransition(() => {
          setGeoData(worldFeatures);
          setIndiaGeoData(indiaFeatures);
        });
      })
      .catch((err) => {
        console.error("Failed to load map data", err);
        setError("Failed to load map artifacts.");
      });
  }, []);

  const handleSearch = useCallback((name: string) => {
    startTransition(() => {
      setActiveName(name);
      setHasSearched(true);
    });
  }, []);

  // ── API call ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeName) return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      setPopularityData([]);
      setOriginData(null);

      try {
        const data = await fetchNamePopularity(activeName);
        startTransition(() => {
          setPopularityData(data.countries || []);
          setOriginData(data.origin || null);
        });
      } catch (err) {
        // Case 4 — API failure
        setError("api");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeName]);

  const mapLoading = isLoading || isPending;

  // ── Status message resolver ───────────────────────────────────────────────────
  const resolveStatusMessage = () => {
    if (mapLoading) return ZIZIAN_MESSAGES.loading;                                  // loading
    if (error === "api") return ZIZIAN_MESSAGES.apiError;                           // Case 4
    if (hasSearched && !hasAnyData) return ZIZIAN_MESSAGES.noData;                  // Case 3
    if (hasSearched && !hasOrigin && hasCountries) return ZIZIAN_MESSAGES.noOrigin; // Case 2
    return null;                                                                      // Case 1 — map renders, no message needed
  };

  const statusMessage = resolveStatusMessage();

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-[#5d4037] overflow-x-hidden font-imfell">
      {name ? (
        <div className="w-full flex flex-col space-y-4">

          {/* Map section */}
          <section className="w-full flex justify-center">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center italic text-[#5d4037]">
                  Restoring World Map...
                </div>
              }
            >
              {geoData ? (
                <WorldMap
                  popularityData={popularityData}
                  originData={originData}
                  isLoading={mapLoading}
                  geoData={geoData}
                  indiaGeoData={indiaGeoData}
                  hasSearched={hasSearched}
                />
              ) : (
                <div className="w-full aspect-[2/1] border-4 border-[#5d4037] bg-[#d9c5a0] flex items-center justify-center shadow-lg">
                  <p className="animate-pulse text-[#5d4037] font-bold uppercase tracking-widest">
                    Loading Map Archives...
                  </p>
                </div>
              )}
            </Suspense>
          </section>

          {/* Zizian status log — renders only when needed
          {statusMessage && <ZizianLog message={statusMessage} />} */}

          {/* <section className="w-full flex justify-center pb-8">
            <NameInput onSearch={handleSearch} isLoading={mapLoading} />
          </section> */}

        </div>
      ) : (
        <div
          className="relative w-full aspect-[2/1] shadow-2xl overflow-hidden antique-texture"
          style={{ backgroundImage: "url(src/assets/glitch.gif)" }}
        ></div>
      )}
    </main>
  );
};

export default Display3;