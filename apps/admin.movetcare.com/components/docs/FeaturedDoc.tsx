import Link from 'next/link';

export default function FeaturedDoc({ title, excerpt, slug }: any) {
  return (
    <section>
      <Link href={`/docs/${slug}`}>
        <div className="group flex flex-col border border-movet-gray rounded-xl px-4 hover:cursor-pointer mb-8">
          <h2 className="leading-tight">
            <a className="group-hover:underline ease-in-out duration-500">
              {title}
            </a>
          </h2>
          <div>
            <p className="text-sm leading-relaxed mb-4">{excerpt}</p>
          </div>
        </div>
      </Link>
    </section>
  );
}
