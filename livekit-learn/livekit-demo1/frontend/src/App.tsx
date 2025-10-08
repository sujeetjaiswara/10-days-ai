import {
  ControlBar,
  RoomAudioRenderer,
  RoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Room } from "livekit-client";
import { useEffect, useState } from "react";
import MyVideoConference from "./components/MyVideoConference";

const serverUrl = import.meta.env.VITE_LIVEKIT_URL;
const token = import.meta.env.VITE_LIVEKIT_TOKEN;

function App() {
  const [room] = useState(
    () =>
      new Room({
        // Optimize video quality for each participant's screen
        adaptiveStream: true,

        // Enable automatic audio/video quality optimization
        dynacast: true,
      })
  );

  // Connect to room
  useEffect(() => {
    let mounted = true;

    const connect = async () => {
      if (mounted) {
        await room.connect(serverUrl, token);
      }
    };
    connect();

    return () => {
      mounted = false;
      room.disconnect();
    };
  }, [room]);

  return (
    <RoomContext.Provider value={room}>
      <div data-lk-theme="default" style={{ height: "70vh" }}>
        {/* Your custom component with basic video conferencing functionality. */}
        <MyVideoConference />

        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        <RoomAudioRenderer />

        {/* Controls for the user to start/stop audio, video, and screen share tracks */}
        <ControlBar />
      </div>
    </RoomContext.Provider>
  );
}

export default App;
