import ChatBox from "./components/ChatBox";
import ShivaBackground from "./components/ShivaBackground";
import { DeviceTrackingProvider } from "./components/DeviceTrackingProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#000" }}>
        <DeviceTrackingProvider>
          <ShivaBackground />

          <div style={{ position: "relative", zIndex: 1 }}>
            {children}
          </div>

          {/* CHAT UI ON TOP */}
          <ChatBox />
        </DeviceTrackingProvider>
      </body>
    </html>
  );
}