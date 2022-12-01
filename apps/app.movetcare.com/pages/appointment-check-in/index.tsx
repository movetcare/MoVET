import { AppHeader } from "components/AppHeader";
import { ClientCheckIn } from "forms/checkin/clientCheckIn";
import Head from "next/head";
import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";

export default function CheckIn() {
  const router = useRouter();
  const { mode } = router.query || {};
  return (
    <>
      <Head>
        <title>Appointment Check In</title>
        <meta
          name="description"
          content="Check in for your MoVET appointment!"
        />
      </Head>
      <div className="w-full flex-1">
        <AppHeader />
        {mode === "kiosk" ? (
          <section className="flex flex-col justify-center items-center max-w-xl mx-auto bg-white rounded-xl mb-8 p-8">
            <QRCodeSVG
              size={250}
              value={
                (window.location.hostname === "localhost"
                  ? "http://localhost:3001"
                  : "https://app.movetcare.com") + "/appointment-check-in/"
              }
            />
            <p className="text-center mt-8 italic text-xl">
              Scan the QR code above to join the line
            </p>
          </section>
        ) : (
          <ClientCheckIn />
        )}
      </div>
    </>
  );
}
