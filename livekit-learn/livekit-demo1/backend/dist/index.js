import cors from "cors";
import "dotenv/config";
import express from "express";
import { AccessToken, WebhookReceiver } from "livekit-server-sdk";
const SERVER_PORT = process.env.SERVER_PORT || 6080;
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || "devkey";
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || "secret";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.raw({ type: "application/webhook+json" }));
// This token encodes the identity of a participant, name of the room, capabilities and permissions.
app.post("/token", async (req, res) => {
    const roomName = req.body.roomName;
    const participantName = req.body.participantName;
    if (!roomName || !participantName) {
        res
            .status(400)
            .json({ message: "Please provide both room name and participant name." });
        return;
    }
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity: participantName,
    });
    at.addGrant({ roomJoin: true, room: roomName });
    const token = await at.toJwt();
    res.json({ token });
});
const webhookReceiver = new WebhookReceiver(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
app.post("/livekit/webhook", async (req, res) => {
    try {
        const event = await webhookReceiver.receive(req.body, req.get("Authorization"));
        console.log(event);
    }
    catch (error) {
        console.error("Error validating webhook event", error);
    }
    res.status(200).send();
});
app.listen(SERVER_PORT, () => {
    console.log(`Server running at http://localhost:${SERVER_PORT}`);
});
//# sourceMappingURL=index.js.map