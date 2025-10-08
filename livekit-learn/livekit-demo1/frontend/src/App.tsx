import {
  ControlBar,
  RoomAudioRenderer,
  RoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Room } from "livekit-client";
import { useEffect, useState } from "react";
import MyVideoConference from "./components/MyVideoConference";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Toaster, toast } from "sonner";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;
const API_URL = import.meta.env.VITE_API_URL;

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

  const [token, setToken] = useState<string | "">("");
  const [roomName, setRoomName] = useState<string>("");
  const [participantName, setParticipantName] = useState<string>("");

  // Connect to the room when the token is set
  useEffect(() => {
    if (token) {
      room.connect(LIVEKIT_URL, token);
    }

    return () => {
      room.disconnect();
    };
  }, [room]);

  // Get the token from the backend and connect to the room
  async function onConnect() {
    try {
      if (!roomName || !participantName) {
        toast.error("Room name and participant name are required");
        return;
      }

      const response = await fetch(`${API_URL}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName, participantName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to connect to room");
      }

      toast.success("Connected to the room successfully!");
      setToken(data.token);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-full max-w-7xl mx-auto gap-4">
        {token ? (
          <RoomContext.Provider value={room}>
            <div
              data-lk-theme="default"
              style={{ height: "100vh" }}
              className="w-full"
            >
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

            <Card className="w-full max-w-2xl p-6">
              <form className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input
                    id="roomName"
                    type="text"
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="participantName">Participant Name</Label>
                  <Input
                    id="participantName"
                    type="text"
                    onChange={(e) => setParticipantName(e.target.value)}
                  />
                </div>
              </form>
              <Button variant={"destructive"} onClick={onConnect}>
                Connect
              </Button>
            </Card>
          </div>
        )}
      </div>
      <Toaster richColors />
    </>
  );
}

export default App;
