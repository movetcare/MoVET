import Layout from "components/Layout";
import Image from "next/image";
import Link from "next/link";
import { classNames } from "utilities";
import { BlogPost } from "types";
import Head from "next/head";
import { Fragment } from "react";
import { CallToAction } from "ui";

const posts = [
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
    isFeatured: true,
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
      name: "Dr. Barbra Caldwell",
      href: "#",
      imageUrl: "/images/blog/dr-barbara-caldwell.png",
    },
  },
  {
    isFeatured: false,
    title: "HOWL-O-WEEN Pet Costume Contest - Sunday, Oct 30th @ 1pm",
    href: "/blog/howl-o-ween",
    category: { name: "Community", href: "#", color: "bg-movet-magenta" },
    description:
      "Come one come all! Join us, Oct 30th at 1pm in the Belleview Station Dog Park to show off your Halloween Best! We'll have a fall themed photo booth to capture this once-a-year attire!",
    date: "Oct 20th, 2022",
    datetime: "2022-10-20",
    imageUrl: "/images/blog/howl-o-ween.png",
    readingTime: "3 min",
    author: {
      name: "Dr. A",
      href: "#",
      imageUrl: "/images/blog/dr-a.png",
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

export default function Blog() {
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
          <div className="mx-auto mt-8 sm:pb-8 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
            {posts.map((post: BlogPost, index: number) =>
              post.isFeatured ? (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row overflow-hidden rounded-lg shadow-lg col-span-3"
                >
                  <div className="flex-shrink-0 -mb-2">
                    <Link href={post.href}>
                      <Image
                        className="hover:opacity-75 cursor-pointer"
                        src={post.imageUrl}
                        alt=""
                        height={334}
                        width={520}
                      />
                    </Link>
                  </div>
                  <div className="flex flex-1 flex-col justify-between bg-white p-6">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {/*<a href={post.href}>*/}
                        <span
                          className={classNames(
                            post.category.color,
                            "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium text-movet-white"
                          )}
                        >
                          {post.category.name}
                        </span>
                        {/*</a>*/}
                      </p>
                      <Link
                        href={post.href}
                        className="mt-2 block hover:no-underline"
                        passHref
                      >
                        <p className="text-xl font-semibold cursor-pointer text-movet-black hover:no-underline">
                          {post.title}
                        </p>
                      </Link>
                      <Link
                        href={post.href}
                        className="mt-2 block hover:no-underline"
                        passHref
                      >
                        <p className="mt-3 text-base cursor-pointer text-movet-black hover:no-underline">
                          {post.description}
                        </p>
                      </Link>
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
              )
            )}
          </div>
          <div className="mx-auto sm:pb-8 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
            {posts.map((post, index) =>
              !post.isFeatured ? (
                <div
                  key={post.title}
                  className="flex flex-col overflow-hidden rounded-lg shadow-lg"
                >
                  <div className="flex-shrink-0 -mb-2">
                    <Link href={post.href}>
                      <Image
                        className="hover:opacity-75"
                        src={post.imageUrl}
                        alt=""
                        height={340}
                        width={520}
                      />
                    </Link>
                  </div>
                  <div className="flex flex-1 flex-col justify-between bg-white p-6">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        <span
                          className={classNames(
                            post.category.color,
                            "inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium text-movet-white"
                          )}
                        >
                          {post.category.name}
                        </span>
                      </p>
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
                    </div>
                    <div className="mt-3 flex items-center">
                      <div className="flex-shrink-0 mt-3">
                        <span className="sr-only">{post.author.name}</span>
                        <Image
                          className="rounded-full"
                          height={40}
                          width={40}
                          src={post.author.imageUrl}
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
              )
            )}
          </div>
        </div>
      </section>
      <CallToAction />
    </Layout>
  );
}
