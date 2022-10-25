import { AppHeader } from "components/AppHeader";
import { ClientCheckIn } from "forms/checkin/clientCheckIn";
import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";

export default function CheckIn() {
  const router = useRouter();
  const { mode } = router.query || {};
  return (
    <div className="h-screen flex flex-grow items-center justify-center max-w-screen-md mx-auto px-4 sm:px-8 overflow-hidden">
      <main className="w-full flex-1 overflow-hidden">
        <AppHeader />
        {mode === "kiosk" ? (
          <section className="flex flex-col justify-center items-center max-w-xl mx-auto bg-white rounded-xl mb-8 p-8">
            <QRCodeSVG
              size={250}
              value={
                (window.location.hostname === "localhost"
                  ? "http://localhost:3000"
                  : "https://movetcare.com") + "/checkin/"
              }
            />
            <p className="text-center mt-8 italic text-xl">
              Scan the QR code above to join the line
            </p>
          </section>
        ) : (
          <ClientCheckIn />
        )}
      </main>
    </div>
  );
}
