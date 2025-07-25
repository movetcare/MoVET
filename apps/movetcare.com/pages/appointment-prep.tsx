import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Image from "next/image";
import { PopUpAd } from "ui";
import Layout from "components/Layout";
import Head from "next/head";
import { getPopUpAd } from "server";
import type { PopUpAd as PopUpAdType } from "types";
import Link from "next/link";

export async function getStaticProps() {
  return {
    props: {
      popUpAd: (await getPopUpAd()) || null,
    } as any,
  };
}

const AppointmentPrep = ({ popUpAd }: { popUpAd: PopUpAdType }) => {
  const router = useRouter();
  return (
    <Layout>
      <Head>
        <title>How to Prepare for Your Appointment</title>
      </Head>
      <section className="flex flex-col p-4 mx-4 my-8 max-w-screen-lg bg-white rounded-xl sm:p-8 sm:mx-auto">
        <div
          className="flex flex-row justify-center items-center my-4 cursor-pointer"
          onClick={() => router.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <p className="ml-2">Go Back</p>
        </div>
        <div className="mx-auto mb-4 w-36 h-32 sm:w-28 sm:h-24">
          <Image
            src="/images/icons/clinic.svg"
            alt={"appointment icon"}
            height={120}
            width={120}
          />
        </div>
        <h1>MoVET Appointment Prep</h1>
        <h2 className="mb-0">Medical Records:</h2>
        <p>
          If you have booked an appointment for a new pet, please email (or ask
          your previous vet to email) their vaccine and medical records to{" "}
          <a
            href="mailto://info@movetcare.com"
            target="_blank"
            rel="noreferrer"
          >
            info@movetcare.com
          </a>{" "}
          <b>prior</b> to your appointment.
        </p>
        <h2 className="mb-0">Handling Tips for your Pets</h2>
        <p>
          Pets can get nervous and anxious about visiting the veterinarian. We
          want to prevent any nervous behaviors that can later create fearful or
          even aggressive behaviors. Once this happens, veterinary visits can
          become very unpleasant for both owner and pet that we often resign to
          just not taking them to the vet&apos;s office at all anymore.
        </p>
        <p>
          Please let us know in advance of any favorite treat, scratching spot,
          or any behavioral issues you may have encountered with your pet
          previously. Are they food motivated, territorial, or aggressive
          towards humans or other pets? Anything that would make your pet more
          comfortable with us for their visit would be great! We can offer
          anti-anxiety medications ahead of appointments for some patients that
          might need a little help relaxing around us.
        </p>
        <p>
          <i>
            Please{" "}
            <a
              href="https://movetcare.com/contact"
              target="_blank"
              rel="noreferrer"
            >
              contact us
            </a>{" "}
            <b>before your appointment</b> should you feel your pet(s) needs
            more options, such as anxiolytics and / or supplements to continue
            to make your pet&apos;s visit more comfortable. We thank you in
            advance for keeping our staff safe!
          </i>
        </p>
        <h2 className="mb-0">Virtual Consultations</h2>
        <p>
          Please tap the &quot;START CONSULTATION&quot; button in our{" "}
          <a
            href="https://movetcare.com/get-the-app"
            target="_blank"
            rel="noreferrer"
          >
            mobile app
          </a>{" "}
          to start your Virtual Consultation session. Please email{" "}
          <a
            href="mailto://info@movetcare.com?subject=Photos/videos for my appointment"
            target="_blank"
            rel="noreferrer"
          >
            info@movetcare.com
          </a>{" "}
          if you have any pictures or videos that you would like to share with
          us prior to our consultation. Make sure you are using a device with
          good internet connection and access to camera/audio. Our telehealth
          platform allows you to test your device prior to starting the
          consultation. We highly suggest you run those diagnostic tests prior
          to connecting with us.
        </p>
        <p>
          <b>
            The cost of this service is between $32.00 - $50 per consultation.
          </b>
        </p>
        <h3 className="mt-8 text-lg text-center">
          Please{" "}
          <a
            href="https://movetcare.com/contact"
            target="_blank"
            rel="noreferrer"
          >
            email
          </a>{" "}
          (or <a href="tel://7205077387">text us</a>) if you have any questions!
        </h3>
        <div
          className="flex flex-row justify-center items-center my-4 cursor-pointer"
          onClick={() => router.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <p className="ml-2">Go Back</p>
        </div>
      </section>
      {popUpAd?.isActive && (
        <PopUpAd
          autoOpen={popUpAd?.autoOpen}
          icon={popUpAd?.icon}
          title={popUpAd?.title}
          description={popUpAd?.description}
          adComponent={
            <Link href={popUpAd?.link as string}>
              <Image
                className="rounded-xl"
                src={popUpAd?.imagePath as string}
                alt={popUpAd?.title}
                height={popUpAd?.height || 200}
                width={popUpAd?.width || 200}
              />
            </Link>
          }
          ignoreUrlPath={popUpAd?.ignoreUrlPath}
        />
      )}
    </Layout>
  );
};

export default AppointmentPrep;
