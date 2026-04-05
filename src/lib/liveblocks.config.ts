import { createClient } from "@liveblocks/client";

export const liveblocksClient = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {};
    // The Storage tree for the room, for useStorage, useMutation, etc.
    Storage: {};
    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        name: string;
        avatar: string;
        id: string;
        color: string;
      };
    };
    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: {};
    // Custom metadata set on transcription, for useTranscriptionStatus
    TranscriptionMetadata: {};
    // Custom canopy data, for useCanopy
    CanopyData: {};
  }
}

