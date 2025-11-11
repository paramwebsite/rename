import React, { useState } from "react";
import axios from "axios";
import { API_URL, WS_URL } from "../utils/config";

const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!video) {
      setMessage("Please select a video first");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);

    try {
      const res = await axios.post(`${API_URL}/videos/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    }
  };

  return (
    <div className="border-2 border-[#ffa8a8] p-2 bg-[#fff9db]">
      <h2 className="mb-4 text-xl">Upload Video</h2>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="block border border-gray-300 bg-[#fff3bf] rounded-lg p-2 cursor-pointer text-gray-700 mb-2.5"
      />

      <button onClick={handleUpload} className="bg-blue-400 p-2 rounded-2xl font-bold text-[#112A46]">Upload</button>
      <p>{message}</p>



      
    </div>
  );
};

export default VideoUpload;
