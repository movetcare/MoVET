import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";
import { Fragment } from "react";
import { Button, CallToAction } from "ui";
const interceptor = [
  {
    name: "6 Months",
    id: "tier-basic",
  },
  {
    name: "12 Months",
    id: "tier-premium",
  },
];
const interceptorSections = [
  {
    name: "Interceptor Plus",
    features: [
      {
        name: "BLUE - 50.1-100lbs",
        interceptor: { "tier-basic": "$80.99", "tier-premium": "$152.99" },
      },
      {
        name: "YELLOW - 25.1-50lbs",
        interceptor: { "tier-basic": "$68.99", "tier-premium": "$125.99" },
      },
      {
        name: "GREEN - 8.1-25lbs",
        interceptor: { "tier-basic": "$54.99", "tier-premium": "$99.99" },
      },
      {
        name: "ORANGE - 2-8.1lbs",
        interceptor: { "tier-basic": "$53.99 ", "tier-premium": "$97.99" },
      },
    ],
  },
];

const credelio = [
  {
    name: "3 Months",
    id: "tier-basic",
  },
  {
    name: "6 Months",
    id: "tier-premium",
  },
];
const credelioSections = [
  {
    name: "Credelio",
    features: [
      {
        name: "BLUE - 50.1-100lbs",
        credelio: { "tier-basic": "$78.99", "tier-premium": "$148.99" },
      },
      {
        name: "GREEN - 25.1-50lbs",
        credelio: { "tier-basic": "$76.99 ", "tier-premium": "$143.99" },
      },
      {
        name: "ORANGE - 12.1-25lbs",
        credelio: { "tier-basic": "$73.99", "tier-premium": "$142.99" },
      },
      {
        name: "PINK - 6.1-12lbs",
        credelio: { "tier-basic": "$72.99 ", "tier-premium": "$138.99" },
      },
      {
        name: "YELLOW - 4.4-6lbs",
        credelio: { "tier-basic": "$71.99 ", "tier-premium": "$136.99" },
      },
    ],
  },
];

export default function SpotCheckHeartwormClinic() {
  return (
    <Layout>
      <Head>
        <title>Spot Check Heartworm Clinic</title>
        <meta
          name="description"
          content="We want to make sure ALL dogs are protected this Spring from Heartworm disease. MoVET is offering a Heartworm 'Spot Check' Clinic on Sunday, May 19th. Clinic includes a Heartworm Test ($45) and Monthly Heartworm Parasite Prevention. Flea/Tick prevention will also be available."
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content="Spot Check Heartworm Clinic"
        />
        <meta
          name="og:description"
          property="og:description"
          content="We want to make sure ALL dogs are protected this Spring from Heartworm disease. MoVET is offering a Heartworm 'Spot Check' Clinic on Sunday, May 19th. Clinic includes a Heartworm Test ($45) and Monthly Heartworm Parasite Prevention. Flea/Tick prevention will also be available."
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Spot Check Heartworm Clinic" />
        <meta
          name="twitter:description"
          content="We want to make sure ALL dogs are protected this Spring from Heartworm disease. MoVET is offering a Heartworm 'Spot Check' Clinic on Sunday, May 19th. Clinic includes a Heartworm Test ($45) and Monthly Heartworm Parasite Prevention. Flea/Tick prevention will also be available."
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Dr. A" />
        <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
        <meta
          property="og:image"
          content="/images/blog/spot-check-heartworm-clinic.png"
        />
        <meta
          name="twitter:image"
          content="/images/blog/spot-check-heartworm-clinic.png"
        />
      </Head>
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto mt-8 mb-20 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <Image
          className="rounded-xl cursor-pointer"
          src="/images/blog/spot-check-cta.png"
          alt="Spot Check Heartworm Clinic"
          height={300}
          width={900}
          onClick={() =>
            window.open(
              "https://www.signupgenius.com/go/10C0B4AA5AC2CA2FCC61-49569072-spot",
              "_blank",
            )
          }
        />
        <h2 className="text-3xl mt-8 mb-2 text-center">
          Is your pet protected this summer?
        </h2>
        <p className="text-extrabold">
          Swing by MoVET @ Belleview Station for our &quot;SPOT CHECK&quot;
          HEARTWORM CLINIC! Ensuring your pet&apos;s health is a top priority,
          and our clinic offers affordable heartworm testing and preventative
          solutions for both heartworm prevention & flea/tick prevention.
          Don&apos;t miss the chance to safeguard your furry friend against this
          potentially deadly disease.
        </p>
        <p>
          It&apos;s a quick 20-min slot. We&apos;ll have you in-and-out so you
          can get back to enjoying your day with your pet. Our experienced
          veterinary team will be on hand to discuss concerns & questions that
          may arise. Best of all, you don&apos;t have to be an existing client
          to attend!
        </p>
        <div className="my-8">
          <Image
            className="rounded-xl cursor-pointer hidden sm:block"
            src="/images/blog/spot-check-cta-1.png"
            alt="Spot Check Heartworm Clinic"
            height={300}
            width={900}
            onClick={() =>
              window.open(
                "https://www.signupgenius.com/go/10C0B4AA5AC2CA2FCC61-49569072-spot",
                "_blank",
              )
            }
          />
          <Image
            className="rounded-xl cursor-pointer sm:hidden"
            src="/images/blog/spot-check-cta-1-mobile.png"
            alt="Spot Check Heartworm Clinic"
            height={300}
            width={900}
            onClick={() =>
              window.open(
                "https://www.signupgenius.com/go/10C0B4AA5AC2CA2FCC61-49569072-spot",
                "_blank",
              )
            }
          />
        </div>
        <h3 className="text-xl">Pricing - Heartworm Prevention</h3>
        <div>
          <div className="mx-auto px-6 lg:px-8">
            <div className="isolate">
              <div className="relative -mx-8">
                <table className="w-full table-fixed border-separate border-spacing-x-8 text-left">
                  <caption className="sr-only">Pricing plan comparison</caption>
                  <colgroup>
                    <col className="w-1/3" />
                    <col className="w-1/3" />
                    <col className="w-1/3" />
                  </colgroup>
                  <thead>
                    <tr>
                      <td />
                      {interceptor.map((tier) => (
                        <th
                          key={tier.id}
                          scope="col"
                          className="px-6 pt-6 xl:px-8 xl:pt-8"
                        >
                          <div className="text-center">{tier.name}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {interceptorSections.map((section) => (
                      <Fragment key={section.name}>
                        <tr>
                          <th
                            scope="colgroup"
                            colSpan={4}
                            className={"pb-2 text-lg font-extrabold"}
                          >
                            {section.name}
                          </th>
                        </tr>
                        {section.features.map((feature: any) => (
                          <tr key={feature.name}>
                            <th scope="row">{feature.name}</th>
                            {interceptor.map((tier: any) => (
                              <td key={tier.id} className="px-6 py-2 xl:px-8">
                                <div className="text-center">
                                  {feature.interceptor[tier.id]}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-8 border-movet-gray border-1 w-full border-t" />
        <h3 className="text-xl">Pricing - Flea & Tick Prevention</h3>
        <div className="mb-8">
          <div className="mx-auto px-6 lg:px-8">
            <div className="isolate">
              <div className="relative -mx-8">
                <table className="w-full table-fixed border-separate border-spacing-x-8 text-left">
                  <caption className="sr-only">Pricing plan comparison</caption>
                  <colgroup>
                    <col className="w-1/3" />
                    <col className="w-1/3" />
                    <col className="w-1/3" />
                  </colgroup>
                  <thead>
                    <tr>
                      <td />
                      {credelio.map((tier) => (
                        <th
                          key={tier.id}
                          scope="col"
                          className="px-6 pt-6 xl:px-8 xl:pt-8"
                        >
                          <div className="text-center">{tier.name}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {credelioSections.map((section) => (
                      <Fragment key={section.name}>
                        <tr>
                          <th
                            scope="colgroup"
                            colSpan={4}
                            className={"pb-2 text-lg font-extrabold"}
                          >
                            {section.name}
                          </th>
                        </tr>
                        {section.features.map((feature: any) => (
                          <tr key={feature.name}>
                            <th scope="row">{feature.name}</th>
                            {credelio.map((tier: any) => (
                              <td key={tier.id} className="px-6 py-2 xl:px-8">
                                <div className="text-center">
                                  {feature.credelio[tier.id]}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <a
          href="/files/2021_Elanco_360 Brochure.pdf"
          target="_blank"
          className="text-sm italic text-center"
        >
          * Click here to learn more about Elanco&apos;s Heartworm, Flea & Tick
          Prevention Products.
        </a>
        <h4 className="mt-8 mb-0 text-lg">
          Sign up is required. RSVP now to secure your time slot!
        </h4>
        <p className="text-lg">20-min slots available from 10 AM - 3 PM</p>
        <Button
          text="Schedule an Appointment Today"
          color="red"
          className="my-4"
          onClick={() =>
            window.open(
              "https://www.signupgenius.com/go/10C0B4AA5AC2CA2FCC61-49569072-spot",
              "_blank",
            )
          }
        />
        <p className="text-sm italic sm:w-2/3 text-center">
          * Dog&apos;s Only; Pet&apos;s only over 1 year old; ProHeart
          Injectable will NOT available this day (If interested in this product,
          please make an appointment during normal business hours, as an exam is
          required.) Preselect Heartworm Preventative + Flea/Tick Preventative
          for your pet&apos;s weight range at the time of sign up! Payment will
          be due at the time of service.
        </p>
        <a
          href="https://yourpetandyou.elanco.com/us?utm_source=web&utm_medium=myElanco&utm_campaign=23-Awareness-vetportal"
          target="_blank"
          className="mt-8 mb-2"
        >
          <Image
            src="/images/company-logos/shop/elanco-logo.png"
            alt="Elanco Logo"
            height={40}
            width={120}
            priority
          />
        </a>
        <p className="text-xs">
          This event is sponsored by{" "}
          <a href="https://movetcare.com" target="_blank" className="mt-8 mb-2">
            MoVET @ Belleview Station
          </a>{" "}
          and{" "}
          <a
            href="https://yourpetandyou.elanco.com/us?utm_source=web&utm_medium=myElanco&utm_campaign=23-Awareness-vetportal"
            target="_blank"
            className="mt-8 mb-2"
          >
            Elanco Pet Health.
          </a>
        </p>
        <p className="text-xs mt-0">
          Elanco Rebates Available{" "}
          <a
            href="https://yourpetandyou.elanco.com/us/elanco-rebates"
            target="_blank"
            className="underline font-extrabold text-movet-red"
          >
            HERE
          </a>
          .
        </p>
      </section>
      <CallToAction />
    </Layout>
  );
}
