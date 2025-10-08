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
const token = ""; //import.meta.env.VITE_LIVEKIT_TOKEN;

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
    <>
      <div className="flex flex-col items-center justify-center h-screen w-full gap-4">
        {token ? (
          <RoomContext.Provider value={room}>
            <div data-lk-theme="default" style={{ height: "100vh" }}>
              {/* Your custom component with basic video conferencing functionality. */}
              <MyVideoConference />

              {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
              <RoomAudioRenderer />

              {/* Controls for the user to start/stop audio, video, and screen share tracks */}
              <ControlBar />
            </div>
          </RoomContext.Provider>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome to LiveKit Demo
              </h1>
              <p className="text-sm text-gray-500">
                Click the button below to join a room.
              </p>
            </div>
            <button
              className="bg-purple-900 hover:bg-purple-800 shadow-md text-white px-4 py-2 rounded-md"
              onClick={async () => {
                const pasted = window.prompt("Paste your LiveKit token");
                if (!pasted) return;
                try {
                  await room.connect(serverUrl, pasted);
                } catch (err: any) {
                  console.error("Failed to connect to LiveKit room:", err);
                  alert(`Connection failed: ${err?.message ?? err}`);
                }
              }}
            >
              Connect Room
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
