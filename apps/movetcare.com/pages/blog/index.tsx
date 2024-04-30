import Layout from "components/Layout";
import Image from "next/image";
import Link from "next/link";
import { classNames } from "utilities";
import { BlogPost } from "types";
import Head from "next/head";
import { Fragment } from "react";
import { CallToAction, PopUpAd } from "ui";
import { getPopUpAd } from "server";
import type { PopUpAd as PopUpAdType } from "types";

const posts: Array<BlogPost> = [
  {
    isFeatured: true,
    title: "Spot Check Heartworm Clinic - May 19th",
    href: "/blog/spot-check-heartworm-clinic",
    category: { name: "Health & Wellness", href: "#", color: "bg-movet-yellow" },
    description:
      "We want to make sure ALL dogs are protected this Spring from Heartworm disease. MoVET is offering a Heartworm 'Spot Check' Clinic on Sunday, May 19th. Clinic includes a Heartworm Test ($45) and Monthly Heartworm Parasite Prevention. Flea/Tick prevention will also be available.",
    date: "April 30th, 2024",
    datetime: "2024-04-30",
    imageUrl: "/images/blog/spot-check-heartworm-clinic.png",
    readingTime: "1 min",
    author: {
      name: "Dr. A",
      href: "#",
      imageUrl: "/images/blog/dr-a.png",
    },
  }, {
    isFeatured: true,
    title: "Puppy Love Valentines Photo Event - Saturday, Feb 3rd  10AM-12PM",
    href: "/blog/puppy-love-photo-shoot",
    category: { name: "Community", href: "#", color: "bg-movet-magenta" },
    description:
      "Stop by MoVET @ Belleview Station Saturday, Feb 3rd from 10 AM to noon for complimentary valentines-themed photos of you and your fur-baby! The setup will be casual + festive. Choose to take your photo inside with Valentines props (roses, heart balloons, etc) - or outside for a more urban background. This event is sponsored by Jessica Davis of Keller Williams DTC + MoVET @ Belleview Station. RSVP's are required.",
    date: "Jan 2nd, 2024",
    datetime: "2024-01-22",
    imageUrl: "/images/blog/puppy-love-photo-shoot.png",
    readingTime: "1 min",
    author: {
      name: "Dr. A",
      href: "#",
      imageUrl: "/images/blog/dr-a.png",
    },
  },
  {
    isFeatured: false,
    title: "Annual HOWL-O-WEEN Pet Costume Contest - Sunday, Oct 29th at 1PM",
    href: "/blog/howl-o-ween",
    category: { name: "Community", href: "#", color: "bg-movet-magenta" },
    description:
      "Join us at the Belleview Station Dog Park for this fun and FREE event! Enjoy a Photo Booth, Treats, and Belly Rubs. Dress your furry friend in their most adorable, scary, or hilarious costume. The more creative the better!",
    date: "Oct 29th, 2023",
    datetime: "2023-10-29",
    imageUrl: "/images/blog/howl-o-ween-clip.png",
    readingTime: "3 min",
    author: {
      name: "Dr. A",
      href: "#",
      imageUrl: "/images/blog/dr-a.png",
    },
  },
  {
    isFeatured: false,
    isExternalLink: true,
    title:
      "MoVET @ Belleview Station Voted a Neighborhood Fave in Nextdoor's 2023 Local Business Awards",
    href: "https://nextdoor.com/pages/movet-centennial-co/",
    category: [
      {
        name: "Press Release",
        href: "#",
        color: "bg-movet-green",
      },
      { name: "Community", href: "#", color: "bg-movet-magenta" },
    ],
    description:
      '"Neighbors know best, and Nextdoor\'s Neighborhood Faves are the only annual awards celebrating the businesses that are most loved by locals. This prestigious recognition is only awarded to 1% of the local businesses on Nextdoor and is a testament to the positive impact they have had on their community." - Nextdoor CEO Sarah Friar',
    date: "August 9th, 2023",
    datetime: "2023-08-09",
    imageUrl: "/images/blog/nextdoor-fave.jpg",
    readingTime: "1 min",
    author: {
      name: "Nextdoor",
      href: "#",
      imageUrl: "/images/blog/nextdoor-logo.png",
    },
  },
  {
    isFeatured: false,
    isExternalLink: true,
    title:
      "Dr. Caldwell Featured in \"Dog Days of Summer: Chip's Tips & Dale's Don'ts\"",
    href: "https://www.weathernationtv.com/news/dog-days-of-summer-meet-chip-dale",
    category: [
      {
        name: "Press Release",
        href: "#",
        color: "bg-movet-green",
      },
      {
        name: "Health & Wellness",
        href: "#",
        color: "bg-movet-yellow",
      },
    ],
    description:
      "\"The Dog Days of Summer are upon us, meaning it's the hottest time of the year extending from early July into mid-August. WeatherNation has all four paws covered with Chip's Tips and Dale's Don'ts so you and your furry friends can stay safe this season!\"",
    date: "August 7th, 2023",
    datetime: "2023-08-07",
    imageUrl: "/images/blog/weather-nation-feature-dr-caldwell.png",
    readingTime: "5 min",
    author: {
      name: "Weather Nation",
      href: "#",
      imageUrl: "/images/blog/weather-nation-logo.png",
    },
  },
  {
    isFeatured: false,
    isExternalLink: true,
    title: "MoVET @ Belleview Station Receives 2023 Denver Award",
    href: "https://denverco.businessawardlocal.com/PressReleaseub.aspx?cc=DMN7-ZBZE-R8XX",
    category: {
      name: "Press Release",
      href: "#",
      color: "bg-movet-green",
    },
    description:
      '"Each year, the Denver Award Program identifies companies that we believe have achieved exceptional marketing success in their local community and business category. These are local companies that enhance the positive image of small business through service to their customers and our community. These exceptional companies help make the Denver area a great place to live, work and play."',
    date: "August 2nd, 2023",
    datetime: "2023-08-02",
    imageUrl: "/images/logos/logo.png",
    readingTime: "1 min",
    author: {
      name: "Denver Award Program",
      href: "#",
      imageUrl: "/images/logos/logo-paw-black.png",
    },
  },
  {
    isFeatured: false,
    title:
      "Pawsitive Vibes: Canine Massage for Optimal Veterinary Health and Wellness",
    href: "/blog/canine-massage-with-patti-fluegel",
    category: {
      name: "Health & Wellness",
      href: "#",
      color: "bg-movet-yellow",
    },
    description:
      "Just like humans, dogs can benefit greatly from the power of touch. Canine massage is not only a luxurious treat for your beloved pet, but it also offers a myriad of health benefits that promote relaxation, pain relief, and overall well-being.",
    date: "July 5th, 2023",
    datetime: "2023-06-05",
    imageUrl: "/images/blog/canine-massage.png",
    readingTime: "3 min",
    author: {
      name: "Patti Fluegel, VT, CCMT",
      href: "#",
      imageUrl: "/images/blog/patti-fluegel.png",
    },
  },
  {
    isFeatured: false,
    title: "Banish Doggy Breath and Get Kissable Canine Smiles Again!",
    href: "/blog/banish-bad-dog-breath",
    category: {
      name: "Health & Wellness",
      href: "#",
      color: "bg-movet-yellow",
    },
    description:
      "We are excited to move forward with oral health education and better overall oral care for our canine and feline friends at home with the help of K9 Smiles!",
    date: "May 16th, 2023",
    datetime: "2023-05-16",
    imageUrl: "/images/blog/canine-smiles-clinic.png",
    readingTime: "3 min",
    author: {
      name: "Barbara Caldwell, DVM",
      href: "#",
      imageUrl: "/images/blog/dr-barbara-caldwell.png",
    },
  },
  {
    isFeatured: false,
    title: "K-9 Smiles Teeth Cleaning Clinic @ MoVET",
    href: "/blog/k9-smiles-clinic-for-cats-and-dogs",
    category: {
      name: "Health & Wellness",
      href: "#",
      color: "bg-movet-yellow",
    },
    description:
      "MoVET is partnering with K-9 Smiles to offer a safe and affordable teeth cleaning clinic for your dog or cat! Their trained technicians clean your pet's teeth under the supervision of one of MoVET's licensed veterinarians.",
    date: "April 19th, 2023",
    datetime: "2023-03-19",
    imageUrl: "/images/blog/k9-smiles-logo.png",
    readingTime: "1 min",
    author: {
      name: "Dr A",
      href: "#",
      imageUrl: "/images/blog/dr-a.png",
    },
  },
  {
    isFeatured: false,
    title: "I Chews You!",
    href: "/blog/i-chews-you",
    category: { name: "Community", href: "#", color: "bg-movet-magenta" },
    description:
      "We all know Valentine's Day as the holiday to celebrate our significant others, but what about the OTHER significant other? (You know, the furry one with a wagging tail and slobbery kisses). It's not unusual these days for pet-owners to consider their fur-baby to be the great love of their life. These adorable  Valentine's deserve to be celebrated this February just like anyone else would! Unlike your human partner, you pet would not appreciate the flowers and boxes of chocolates… so what can you do for your Furry Valentine? Here's 5 ideas to make them feel extra loved this Valentine's Day!",
    date: "Feb 9th, 2023",
    datetime: "2023-02-09",
    imageUrl: "/images/blog/i-chews-you.jpg",
    readingTime: "3 min",
    author: {
      name: "Rachel Bloch",
      href: "#",
      imageUrl: "/icon-192x192.png",
    },
  },
  {
    isFeatured: false,
    title: "Spring Heartworm Clinic",
    href: "/blog/2023-spring-heartworm-clinic",
    category: {
      name: "Health & Wellness",
      href: "#",
      color: "bg-movet-yellow",
    },
    description:
      "Our 1st Annual Spring Heartworm Clinic is now open for bookings!",
    date: "Feb 8th, 2023",
    datetime: "2023-02-08",
    imageUrl: "/images/blog/heartworm-clinic.png",
    readingTime: "1 min",
    author: {
      name: "Dr. A",
      href: "#",
      imageUrl: "/images/blog/dr-a.png",
    },
  },
  {
    isFeatured: false,
    title: "6 Reasons Why We're Thankful For Our Pets This Thanksgiving Season",
    href: "/blog/six-reasons-we-are-thankful-for-our-pets",
    category: { name: "Community", href: "#", color: "bg-movet-magenta" },
    description:
      "They are our fur-babies, what's not to love? Humans and their pets can develop such special bonds. It's often something not understood until you are lucky enough to experience it yourself. As we approach the busy season of the holidays, don't forget to take a few moments each day to show your pet some extra love!",
    date: "Nov 21st, 2022",
    datetime: "2022-11-21",
    imageUrl: "/images/blog/six-reasons.jpg",
    readingTime: "3 min",
    author: {
      name: "Rachel Bloch",
      href: "#",
      imageUrl: "/icon-192x192.png",
    },
  },
  {
    isFeatured: false,
    title: "Black Friday Deal - Free Exam w/ Purchase",
    href: "/blog/black-friday-deal-2022",
    category: { name: "Deals", href: "#", color: "bg-movet-green" },
    description:
      "Spend $30 or more in the boutique on November 25th and get a FREE veterinary exam!",
    date: "Nov 17th, 2022",
    datetime: "2022-11-17",
    imageUrl: "/images/blog/crop-black-friday-deal-2022.png",
    readingTime: "1 min",
    author: {
      name: "Dr. A",
      href: "#",
      imageUrl: "/images/blog/dr-a.png",
    },
  },
  {
    isFeatured: false,
    title: "Over Wintering – Heartworm Disease in Colorado",
    href: "/blog/winter-heartworm",
    category: {
      name: "Health & Wellness",
      href: "#",
      color: "bg-movet-yellow",
    },
    description:
      "Mosquitos are found in the Denver & Front Range areas throughout the winter months and still have the potential to spread dangerous and deadly heartworm disease. It is important that your pet be protected.",
    date: "Nov 17th, 2022",
    datetime: "2022-11-17",
    imageUrl: "/images/blog/crop-winter-heartworm.png",
    readingTime: "2 min",
    author: {
      name: "Barbara Caldwell, DVM",
      href: "#",
      imageUrl: "/images/blog/dr-barbara-caldwell.png",
    },
  },
  {
    isFeatured: false,
    title: "Walk to find a cure at the Susan G. Komen “More Than Pink” Walk",
    href: "/blog/susan-g-komen-more-than-pink-walk",
    category: { name: "Community", href: "#", color: "bg-movet-magenta" },
    description:
      'October is National Breast Cancer Awareness Month, and here at MoVET this cause is very close to our hearts. We would love if you’d consider joining us for the 2022 Colorado Komen "More Than Pink" Walk!',
    date: "Oct 13th, 2022",
    datetime: "2022-10-13",
    imageUrl: "/images/blog/crop-cancer-awareness.png",
    readingTime: "3 min",
    author: {
      name: "Rachel Bloch",
      href: "#",
      imageUrl: "/icon-192x192.png",
    },
  },
];

export async function getStaticProps() {
  return {
    props: {
      popUpAd: (await getPopUpAd()) || null,
    } as any,
  };
}

export default function Blog({ popUpAd }: { popUpAd: PopUpAdType }) {
  return (
    <Layout>
      <Head>
        <title>Blog</title>
      </Head>
      <section className="px-4 md:px-0px-4 md:px-0 pb-16 sm:pb-20">
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl tracking-wide mt-8 text-center">
              From The Blog
            </h2>
          </div>
          <div className="mx-auto mt-8 -mb-8 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
            {posts.map((post: BlogPost, index: number) =>
              post.isFeatured ? (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row overflow-hidden rounded-lg shadow-lg col-span-3 items-center bg-white"
                >
                  <div className="flex-shrink-0 -mb-2 bg-white">
                    {post.isExternalLink ? (
                      <a href={post.href} target="_blank">
                        <Image
                          className="hover:opacity-75 cursor-pointer"
                          src={post.imageUrl}
                          alt=""
                          height={510}
                          width={510}
                        />
                      </a>
                    ) : (
                      <Link href={post.href}>
                        <Image
                          className="hover:opacity-75 cursor-pointer"
                          src={post.imageUrl}
                          alt=""
                          height={510}
                          width={510}
                        />
                      </Link>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between bg-white p-6">
                    <div className="flex-1">
                      <div className="flex flex-row items-center">
                        {Array.isArray(post.category) ? (
                          post.category.map((cat: any) => (
                            <p className="text-sm font-medium mr-2">
                              <span
                                className={classNames(
                                  cat.color,
                                  "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium text-movet-white",
                                )}
                              >
                                {cat.name}
                              </span>
                            </p>
                          ))
                        ) : (
                          <p className="text-sm font-medium">
                            <span
                              className={classNames(
                                post.category.color,
                                "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium text-movet-white",
                              )}
                            >
                              {post.category.name}
                            </span>
                          </p>
                        )}
                      </div>
                      {post.isExternalLink ? (
                        <>
                          <a
                            href={post.href}
                            target="_blank"
                            className="mt-2 block hover:no-underline"
                          >
                            <p className="text-xl font-semibold cursor-pointer text-movet-black hover:no-underline">
                              {post.title}
                            </p>
                          </a>
                          <a
                            href={post.href}
                            target="_blank"
                            className="mt-2 block hover:no-underline"
                          >
                            <p className="mt-3 text-base cursor-pointer text-movet-black hover:no-underline">
                              {post.description}
                            </p>
                          </a>
                        </>
                      ) : (
                        <>
                          <Link
                            href={post.href}
                            className="mt-2 block hover:no-underline"
                          >
                            <p className="text-xl font-semibold cursor-pointer text-movet-black hover:no-underline">
                              {post.title}
                            </p>
                          </Link>
                          <Link
                            href={post.href}
                            className="mt-2 block hover:no-underline"
                          >
                            <p className="mt-3 text-base cursor-pointer text-movet-black hover:no-underline">
                              {post.description}
                            </p>
                          </Link>
                        </>
                      )}
                    </div>
                    <div className="mt-3 flex items-center">
                      {post.author.imageUrl && (
                        <div className="flex-shrink-0 mt-3">
                          {/* <a href={post.author.href}> */}
                          <span className="sr-only">{post.author.name}</span>
                          <Image
                            className="rounded-full"
                            height={40}
                            width={40}
                            src={post.author.imageUrl}
                            alt=""
                          />
                          {/* </a> */}
                        </div>
                      )}
                      <div className="ml-3">
                        <p className="text-sm font-medium mb-0">
                          {/*<a href={post.author.href} className="hover:underline">*/}
                          {post.author.name}
                          {/* </a>*/}
                        </p>
                        <div className="flex space-x-1 text-sm">
                          <time dateTime={post.datetime}>{post.date}</time>
                          <span aria-hidden="true">&middot;</span>
                          <span className="italic">
                            {post.readingTime} read
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={index}></div>
              ),
            )}
          </div>
          <div className="mx-auto sm:pb-8 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
            {posts.map((post, index) =>
              !post.isFeatured ? (
                <div
                  key={post.title}
                  className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-white"
                >
                  <div className="flex-shrink-0 -mb-2">
                    {post.isExternalLink ? (
                      <a href={post.href} target="_blank">
                        <Image
                          className="hover:opacity-75"
                          src={post.imageUrl}
                          alt=""
                          height={340}
                          width={520}
                        />
                      </a>
                    ) : (
                      <Link href={post.href}>
                        <Image
                          className="hover:opacity-75"
                          src={post.imageUrl}
                          alt=""
                          height={340}
                          width={520}
                        />
                      </Link>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between bg-white p-6">
                    <div className="flex-1">
                      <div className="flex flex-row items-center">
                        {Array.isArray(post.category) ? (
                          post.category.map((cat: any) => (
                            <p className="text-sm font-medium mr-2">
                              <span
                                className={classNames(
                                  cat.color,
                                  "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium text-movet-white",
                                )}
                              >
                                {cat.name}
                              </span>
                            </p>
                          ))
                        ) : (
                          <p className="text-sm font-medium">
                            <span
                              className={classNames(
                                post.category.color,
                                "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium text-movet-white",
                              )}
                            >
                              {post.category.name}
                            </span>
                          </p>
                        )}
                      </div>
                      {post.isExternalLink ? (
                        <a
                          href={post.href}
                          target="_blank"
                          className="mt-2 block text-movet-black hover:no-underline"
                        >
                          <p className="text-xl font-semibold hover:no-underline">
                            {post.title}
                          </p>
                          <p className="mt-3 text-base hover:no-underline">
                            {post.description}
                          </p>
                        </a>
                      ) : (
                        <Link
                          href={post.href}
                          className="mt-2 block text-movet-black hover:no-underline"
                        >
                          <p className="text-xl font-semibold hover:no-underline">
                            {post.title}
                          </p>
                          <p className="mt-3 text-base hover:no-underline">
                            {post.description}
                          </p>
                        </Link>
                      )}
                    </div>
                    <div className="mt-3 flex items-center">
                      <div className="flex-shrink-0 mt-3">
                        <span className="sr-only">{post.author.name}</span>
                        <Image
                          className="rounded-full"
                          height={40}
                          width={40}
                          src={post.author.imageUrl as any}
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium mb-0">
                          {post.author.name}
                        </p>
                        <div className="flex space-x-1 text-sm">
                          <time dateTime={post.datetime}>{post.date}</time>
                          <span aria-hidden="true">&middot;</span>
                          <span className="italic">
                            {post.readingTime} read
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Fragment key={index}></Fragment>
              ),
            )}
          </div>
        </div>
      </section>
      <CallToAction />
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
}
