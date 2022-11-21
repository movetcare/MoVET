import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";
import { CallToAction } from "ui";

export default function MoreThanPinkWalk() {
  return (
    <Layout>
      <Head>
        <title>
          Think Pink: Walk to find a cure at the Susan G. Komen &quot;More Than
          Pink&quot; Walk
        </title>
        <meta
          name="description"
          content=" October is National Breast Cancer Awareness Month, and here at MoVET
          this cause is very close to our hearts. We would love if you'd
          consider joining us for the 2022 Colorado Komen More Than Pink Walk!"
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content='Think Pink: Walk to find a cure at the Susan G. Komen "More Than
          Pink" Walk'
        />
        <meta
          name="og:description"
          property="og:description"
          content=" October is National Breast Cancer Awareness Month, and here at MoVET
          this cause is very close to our hearts. We would love if you'd
          consider joining us for the 2022 Colorado Komen More Than Pink Walk!"
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content='Think Pink: Walk to find a cure at the Susan G. Komen "More Than
          Pink" Walk'
        />
        <meta
          name="twitter:description"
          content=" October is National Breast Cancer Awareness Month, and here at MoVET
          this cause is very close to our hearts. We would love if you'd
          consider joining us for the 2022 Colorado Komen More Than Pink Walk!"
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Rachel Bloch" />
        <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
        <meta
          property="og:image"
          content="/static/images/blog/crop-cancer-awareness.png"
        />
        <meta
          name="twitter:image"
          content="/static/images/blog/crop-cancer-awareness.png"
        />
      </Head>
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto mt-8 mb-20 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <Image
          className="rounded-xl"
          src="/images/blog/crop-cancer-awareness.png"
          alt="Dr. Caldwell and her daughter, Kiley, at the Komen Walk"
          height={334}
          width={520}
        />
        <p className="italic text-center text-sm mt-4">
          Dr. Caldwell and her daughter, Kiley, at the Komen Walk
        </p>
        <h2 className="text-3xl mt-4 mb-4 text-center">
          Think Pink: Walk to find a cure at the Susan G. Komen &quot;More Than
          Pink&quot; Walk
        </h2>
        <p className="-mb-2">By: Rachel Bloch</p>
        <p className="mb-4 italic text-xs">October 13th, 2022</p>
        <p>
          October is National Breast Cancer Awareness Month, and here at MoVET
          this cause is very close to our hearts. We would love if you&apos;d
          consider joining us for the 2022 Colorado Komen More Than Pink Walk!
        </p>
        <p>
          The Susan G. Komen More Than Pink Walk is a signature fundraising
          event dedicated to raising money while celebrating breast cancer
          survivors, honoring those who have been lost, and supporting their
          loved ones. Fundraising efforts help fund research for cures, increase
          access to care, and provide additional support for the community. Join
          us as we walk for those who can&apos;t, and for those we have lost.
        </p>
        <p>
          The Denver More Than Pink Walk takes place on Sunday, October 23rd,
          2022 at Civic Center Park. The walk site opens at 7am and the opening
          ceremony will begin at 9am. For more information on the walk and how
          to register, please visit the{" "}
          <a
            href="https://secure.info-komen.org/site/TR/RacefortheCure/DEN_ColoradoAffiliate?pg=entry&fr_id=9202"
            target="_blank"
            className="text-movet-magenta hover:underline italic"
            rel="noreferrer"
          >
            Susan G. Komen website
          </a>
          .
        </p>
        <p>
          In the United States, one in eight women will be diagnosed with breast
          cancer in their lifetime. Breast cancer touches the lives of so many
          people in your community, and your support could mean the world to
          them. Bring your friends, family, and dogs along for the 2.5 mile walk
          to cure breast cancer. Alternatively, you could support the Susan G.
          Komen foundation with a donation. If you would like to make a donation
          to support the cause, please visit please visit their{" "}
          <a
            href=" https://secure.info-komen.org/site/Donation2?df_id=23821&mfc_pref=T&23821.donation=form1&creative=fy22_evergreen_moments&s_src=komen.org&s_subsrc=main_nav_donate&_ga=2.112123332.1156552251.1664382098-1252508474.1664382098&_gac=1.124011896.1664382098.CjwKCAjw4c-ZBhAEEiwAZ105RVZEkYm41TaxM4gOBFYfrBnp6iYw57WwVGT3UQb3YjJ7ku9Gm9nCPRoCxbgQAvD_BwE&_gl=1*nh001b*_ga*MTI1MjUwODQ3NC4xNjY0MzgyMDk4*_ga_HGS8BJYTKQ*MTY2NDM4MjA5Ny4xLjEuMTY2NDM4NDQ1Ni42MC4wLjA.*_fplc*VUZkVFM5WmYxOE5PVzFubEtOcDJNODJWaVh2eU9NNjh6ZEQlMkJlVjV4NDFEZUxoTGJFVXI5SmZubUUzYUJWcURhUTA1NWk4UlNXU0Jjb1lZbyUyQjlYJTJCUDc5U1c3bHV4ViUyRkF0bkclMkI2UXhpclRiU04zaFJtZnZYJTJGeE5uQlpVZmpRJTNEJTNE"
            target="_blank"
            className="text-movet-magenta hover:underline italic"
          >
            donation form
          </a>
          .
        </p>
      </section>
      <CallToAction />
    </Layout>
  );
}
