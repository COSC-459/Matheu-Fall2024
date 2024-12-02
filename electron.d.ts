// electron.d.ts
export {};

declare global {
  interface Window {
    electron: {
      onCopyText: (callback: (text: string) => void) => void;
      // Add other methods you are exposing from the Electron preload script
    };
  }
}
