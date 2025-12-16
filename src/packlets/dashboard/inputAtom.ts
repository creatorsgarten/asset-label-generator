import { persistentMap } from "@nanostores/persistent";
import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { PrintType } from "./types";

interface Options {
  type: PrintType;
  tagId: string;
  diameter: number;
  url: string;
  invert: boolean;
}

export const inputAtom = persistentMap<Options>(
  "creatorsgarten:assetLabel:input",
  {
    type: "sticker",
    tagId: "CG00123",
    diameter: 5,
    url: "grtn.org/i",
    invert: false,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export const embeddedModeAtom = atom<boolean>(false);

export const useInputAtom = () => useStore(inputAtom);

const params = new URLSearchParams(window.location.search);
if (params.get("integration") === "grist") {
  // Load https://docs.getgrist.com/grist-plugin-api.js
  const loadScript = async (src: string) => {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  };
  loadScript("https://docs.getgrist.com/grist-plugin-api.js")
    .then(() => {
      // Now the Grist plugin API should be available globally
      const grist = (
        window as unknown as {
          grist: {
            // Tell Grist that you are ready
            ready: () => {};
            // Cursor has moved
            onRecord: (callback: (record: unknown) => void) => {};
          };
        }
      ).grist;
      grist.ready();
      grist.onRecord((record) => {
        const tag = record as {
          ID2: string;
          Diameter?: number;
          PrintType?: PrintType;
          Invert?: boolean;
        };
        if (tag.ID2) {
          inputAtom.setKey("tagId", tag.ID2);
          inputAtom.setKey("diameter", tag.Diameter || 0);
          inputAtom.setKey("type", tag.PrintType || "sticker");
          inputAtom.setKey("invert", !!tag.Invert);
        }
      });
      embeddedModeAtom.set(true);
    })
    .catch((error) => {
      console.error("Error loading Grist plugin API:", error);
    });
}
