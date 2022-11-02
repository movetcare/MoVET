import Layout from "components/Layout";
import Image from "next/image";
import Link from "next/link";
import { classNames } from "utilities";

interface BlogPost {
  isFeatured: boolean;
  title: string;
  href: string;
  category: { name: string; href: string; color: string };
  description: string;
  date: string;
  datetime: string;
  imageUrl: string;
  readingTime: string;
  author: {
    name: string;
    href: string;
    imageUrl: string | null;
  };
}
const posts = [
  {
    isFeatured: true,
    title: "HOWL-O-WEEN Pet Costume Contest - Sunday, Oct 30th @ 1pm",
    href: "/blog/howl-o-ween",
    category: { name: "Community", href: "#", color: "bg-movet-magenta" },
    description:
      "Come one come all! Join us, Oct 30th at 1pm in the Belleview Station Dog Park to show off your Halloween Best! We'll have a fall themed photo booth to capture this once-a-year attire! Come as a couple, or just in an awesome-sauce costume! We hope to see you there! Free treats and belly rubs included for all who come. Best of all, all entry photos will be posted on Instagram and Facebook -- make sure to campaign your friends to vote by LIKING your picture. Winning photo (the one with the most likes) will be announced on Halloween and be featured as MoVET's November PET OF THE MONTH!",
    date: "Oct 20th, 2022",
    datetime: "2022-10-20",
    imageUrl: "/images/blog/howl-o-ween.png",
    readingTime: "3 min",
    author: {
      name: "Dr. A",
      href: "#",
      imageUrl: null,
    },
  },
  {
    isFeatured: true,
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
      imageUrl: null,
    },
  },
  {
    isFeatured: false,
    title: "Ipsa libero labore natus",
    href: "#",
    category: { name: "Article", href: "#", color: "bg-movet-red" },
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto accusantium praesentium eius, ut atque fuga culpa, similique sequi cum eos quis dolorum.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80",
    readingTime: "6 min",
    author: {
      name: "Roel Aufderehar",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    isFeatured: false,
    title: "Lorem ipsum dolor sit amet consectetur",
    href: "#",
    category: { name: "Video", href: "#", color: "bg-movet-green" },
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit facilis asperiores porro quaerat doloribus, eveniet dolore. Adipisci tempora aut inventore optio animi., tempore temporibus quo laudantium.",
    date: "Mar 10, 2020",
    datetime: "2020-03-10",
    imageUrl:
      "https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80",
    readingTime: "4 min",
    author: {
      name: "Brenna Goyette",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    isFeatured: false,
    title: "Tempore temporibus quo laudantium",
    href: "#",
    category: { name: "Case Study", href: "#", color: "bg-movet-yellow" },
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint harum rerum voluptatem quo recusandae magni placeat saepe molestiae, sed excepturi cumque corporis perferendis hic.",
    date: "Feb 12, 2020",
    datetime: "2020-02-12",
    imageUrl:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80",
    readingTime: "11 min",
    author: {
      name: "Daniela Metz",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
];

export default function Blog() {
  return (
    <Layout>
      <section className="px-4 md:px-0px-4 md:px-0 pb-16 sm:pb-20">
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl tracking-wide mt-8 text-center">
              From The Blog
            </h2>
          </div>
          <div className="mx-auto mt-8 sm:pb-8 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
            {posts.map((post: BlogPost, index: number) =>
              post.isFeatured && (index === 0 || index === 1) ? (
                <div
                  key={post.title}
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
                        {/*<a href={post.category.href}>*/}
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
                        <p className="text-xl font-semibold cursor-pointer text-movet-black">
                          {post.title}
                        </p>
                      </Link>
                      <Link
                        href={post.href}
                        className="mt-2 block hover:no-underline"
                        passHref
                      >
                        <p className="mt-3 text-base cursor-pointer text-movet-black">
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
                <></>
              )
            )}
          </div>
          {/* <div className="mx-auto mt-8 mb-8 sm:pb-24 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          {posts.map(post =>
            !post.isFeatured ? (
              <div
                key={post.title}
                className="flex flex-col overflow-hidden rounded-lg shadow-lg"
              >
                <div className="flex-shrink-0 -mb-2">
                  <a href={post.category.href}>
                    <Image
                      className="hover:opacity-75"
                      src={post.imageUrl}
                      alt=""
                      height={340}
                      width={520}

                    />
                  </a>
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      <span
                        className={classNames(
                          post.category.color,
                          'inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium text-movet-white'
                        )}
                      >
                        {post.category.name}
                      </span>
                    </p>
                    <a href={post.href} className="mt-2 block">
                      <p className="text-xl font-semibold">{post.title}</p>
                      <p className="mt-3 text-base">{post.description}</p>
                    </a>
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
                        <span className="italic">{post.readingTime} read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )
          )}
        </div> */}
        </div>
      </section>
    </Layout>
  );
}
