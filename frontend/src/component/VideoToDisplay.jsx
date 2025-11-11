import React, { useEffect, useState } from "react";
import { API_URL } from "../utils/config";
import axios from "axios";

const VideoToDisplay = () => {
  const [displays, setDisplays] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [selectedDisplay, setSelectedDisplay] = useState("");
  const [msg,setMsg] = useState(null);

  const loadDisplays = async () => {
    const res = await axios.get(`${API_URL}/displays`);
    setDisplays(res.data);

    console.log()
  };

  const loadVideoList = async () => {
    const res = await axios.get(`${API_URL}/videos`);
    setVideos(res.data);
  };

  useEffect(() => {
    loadDisplays();
    loadVideoList();
  }, []);



  const handleAssign = async () => {
    try {
      const res = await axios.put(`${API_URL}/displays/${selectedDisplay}/assign`, {
        videoId: selectedVideo
      });

      const successMsg = `${res.data.updated.original_name} has been assigned to ${res.data.updated.name}`
      setMsg(successMsg)

      setSelectedDisplay("");
      setSelectedVideo("");


      loadDisplays();

      setTimeout(() => {
        setMsg(null)
      }, 4000);

    } catch (err) {
      setMsg(err)
      console.error(err);
    }
  };
  useEffect(() => {
    console.log("Display id:", selectedDisplay);
    console.log("Video id:", selectedVideo);
  }, [selectedDisplay, selectedVideo]);

  return (
    <div className="flex flex-col   bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl">
        <h1 className="text-center mb-10 text-2xl font-bold text-gray-800">
          Assign Video to Display
        </h1>

        <div className="flex gap-8 justify-center">
          {/* Display dropdown */}
          <div className="flex flex-col w-1/3">
            <label
              htmlFor="display-List"
              className="mb-2 text-sm font-medium text-gray-700"
            >
              Select Display
            </label>
            <select
              id="display-List"
              value={selectedDisplay}
              onChange={(e) => setSelectedDisplay(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                -- Choose a display --
              </option>
              {displays.map((display) => (
                <option key={display.id} value={display.id}>
                  {display.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center items-center ">

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-[2rem] h-[2rem]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </div>



          {/* Video dropdown */}
          <div className="flex flex-col w-1/3">
            <label
              htmlFor="video-list"
              className="mb-2 text-sm font-medium text-gray-700"
            >
              Select Video
            </label>
            <select
              id="video-list"
              value={selectedVideo}
              onChange={(e) => setSelectedVideo(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                -- Choose a video --
              </option>
              {videos.map((video) => (
                <option key={video.id} value={video.id}>
                  {video.original_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <p>{msg}</p>
        </div>

        {/* Assign button */}
        <div className="flex justify-center mt-10">
          <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition" onClick={handleAssign}>
            Assign
          </button>
        </div>
      </div>



      <div>
        <h1 className="text-center mb-10 text-2xl font-bold text-gray-800">
          Assign Video to Display
        </h1>


        <div className="grid grid-cols-2 gap-6">



          {displays && displays.map((display) => (
            <div key={display.id} className="bg-white shadow-xl rounded-xl p-6 flex flex-col gap-4 border border-gray-200">

              {/* Header */}
              <div className="bg-amber-200 rounded-md px-4 py-2 text-center font-semibold text-lg">
                Display: <span className="text-gray-700">{display.name??"Not Assigned"}</span>
              </div>

              {/* Video Section */}
              <div className="flex justify-center">
                <video
                  controls
                  className="rounded-lg shadow-lg w-full max-w-[400px] h-[220px] object-contain"
                  preload="metadata"
                  src={`${API_URL}/video/${display.filename}`}
                />
              </div>
            
              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <p className="font-semibold text-gray-700">
                  Display ID: <span className="font-normal text-gray-600">{display.id??"Not Assigned"}</span>
                </p>
                <p className="font-semibold text-gray-700">
                  Video Name: <span className="font-normal text-gray-600">{display.original_name??"Not Assigned"}</span>
                </p>
                <p className="font-semibold text-gray-700">
                  Video ID: <span className="font-normal text-gray-600">{display.assigned_video_id??"Not Assigned"}</span>
                </p>
                <p className="font-semibold text-gray-700">
                  File Name: <span className="font-normal text-gray-600">{display.filename??"Not Assigned"}</span>
                </p>
              </div>
            </div>
          ))}






        </div>






      </div>
    </div>
  );
};

export default VideoToDisplay;
