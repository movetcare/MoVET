import { faPaw } from "@fortawesome/free-solid-svg-icons";
import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";
import { Button, CallToAction } from "ui";

export default function PuppyLovePhotoShoot() {
  return (
    <Layout>
      <Head>
        <title>Puppy Love Valentines Photo Event</title>
        <meta
          name="description"
          content="Stop by MoVET @ Belleview Station Saturday, Feb 3rd from 10 AM to noon for complimentary valentines-themed photos of you and your fur-baby! The setup will be casual + festive. Choose to take your photo inside with Valentines props (roses, heart balloons, etc) - or outside for a more urban background. This event is sponsored by Jessica Davis of Keller Williams DTC + MoVET @ Belleview Station. RSVP's are required."
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content="Puppy Love Valentines Photo Event"
        />
        <meta
          name="og:description"
          property="og:description"
          content="Stop by MoVET @ Belleview Station Saturday, Feb 3rd from 10 AM to noon for complimentary valentines-themed photos of you and your fur-baby! The setup will be casual + festive. Choose to take your photo inside with Valentines props (roses, heart balloons, etc) - or outside for a more urban background. This event is sponsored by Jessica Davis of Keller Williams DTC + MoVET @ Belleview Station. RSVP's are required."
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="Puppy Love Valentines Photo Event"
        />
        <meta
          name="twitter:description"
          content="Stop by MoVET @ Belleview Station Saturday, Feb 3rd from 10 AM to noon for complimentary valentines-themed photos of you and your fur-baby! The setup will be casual + festive. Choose to take your photo inside with Valentines props (roses, heart balloons, etc) - or outside for a more urban background. This event is sponsored by Jessica Davis of Keller Williams DTC + MoVET @ Belleview Station. RSVP's are required."
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Dr. A" />
        <meta
          property="og:image"
          content="/static/images/blog/puppy-love-photo-shoot.png"
        />
        <meta
          name="twitter:image"
          content="/static/images/blog/puppy-love-photo-shoot.png"
        />
      </Head>
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto mt-8 mb-20 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <Image
          className="rounded-xl"
          src="/images/blog/puppy-love-photo-shoot.png"
          alt="Puppy Love Valentines Photo Event"
          height={484}
          width={820}
        />
        <p className="text-lg">
          Stop by MoVET @ Belleview Station Saturday, Feb 3rd from 10 AM to noon
          for complimentary valentines-themed photos of you and your fur-baby!
          The setup will be casual + festive. Choose to take your photo inside
          with Valentines props (roses, heart balloons, etc) - or outside for a
          more urban background. This event is sponsored by Jessica Davis of
          Keller Williams DTC + MoVET @ Belleview Station. RSVP&apos;s are
          required. Click the button below to submit your RSVP.
        </p>
        <Button
          color="red"
          icon={faPaw}
          iconSize={"sm"}
          text="RSVP"
          className={"w-full md:w-1/3 my-8"}
          onClick={() =>
            window.open(
              "https://www.signupgenius.com/go/10C0E4BAAA92AAAFAC16-47363310-puppy",
              "_blank",
            )
          }
        />
      </section>
      <CallToAction />
    </Layout>
  );
}
