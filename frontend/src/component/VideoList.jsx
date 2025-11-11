import { useEffect, useState } from "react";
import { API_URL, WS_URL } from "../utils/config";
import axios from 'axios';

export default function Dashboard() {
  const [videos, setVideos] = useState([]);

  const loadVideo = async ()=>{

      const res = await axios.get(`${API_URL}/videos`);
      setVideos(res.data);
  }

  useEffect(() => {
    loadVideo();
  }, []);

  return (
    <div className="p-4 border-2 border-[#ffa8a8] p-2 bg-[#fff9db]">
      <h2 className="text-xl font-bold mb-4">Uploaded Videos</h2>
      <div className="grid grid-cols-4 gap-4">
        {videos.map(video => (
          <div key={video.id} className="border rounded-lg p-1  h-[200px] flex justify-around items-center ">
            <video
              controls
              className="h-[100%] w-[50%] "
              preload="metadata"
              src={`${API_URL}/video/${video.filename}`}
            />
            <p className="mt-2 text-center">{video.original_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
