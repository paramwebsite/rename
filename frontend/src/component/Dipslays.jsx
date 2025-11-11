import React, { useEffect, useState } from "react";
import axios from 'axios'
import { API_URL } from "../utils/config";

const Displays = () => {
    const [displayName, setDisplayName] = useState("");
    const [displays, setDisplays] = useState(null);
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        console.log("Current input:", displayName);
    }, [displayName]);



 const handleAddDisplay = async () => {
  if (!displayName.trim()) {
    setMsg("Display name cannot be empty");
    return;
  }

  try {
    await axios.post(`${API_URL}/displays`, {
      name: displayName,
    });

   
    await loadDisplays();


    setMsg("Display added successfully!");
  } catch (err) {
    console.error(err);
    setMsg("Failed to add display.");
  } finally {
    setDisplayName(""); // clear input
  }
};





    const loadDisplays = async () => {
        const res = await axios.get(`${API_URL}/displays`);
        console.log(res.data);
        setDisplays(res.data)
    }

    useEffect(() => {
        loadDisplays();
    }, [])

    useEffect(() => {
        console.log("displays:", displays)
    }, [displays])

    return (
        <div className="flex flex-col gap-14 min-h-screen ">
            <div className=" bg-white shadow-lg  p-6 w-full ">
               
                <div className="flex flex-col gap-4">
                    {/* Input field */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="DisplayName"
                            className="mb-1 text-sm font-medium text-gray-700"
                        >
                            Enter your Name
                        </label>
                        <input
                            id="DisplayName"
                            type="text"
                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter Your name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                        <p>{msg}</p>
                    </div>

                    {/* Button */}
                    <button
                        onClick={handleAddDisplay}
                        className=" w-28 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Submit
                    </button>
                </div>
            </div>

           


        </div>
    );
};

export default Displays;
