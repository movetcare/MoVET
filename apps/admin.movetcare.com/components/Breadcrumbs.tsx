import { faChevronRight, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Breadcrumbs({
  pages,
}: {
  pages: Array<{
    name: string;
    href: string;
    current: boolean;
  }>;
}) {
  return (
    <nav className="flex overflow-hidden" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <Link href={pages[0].href}>
            <div className="text-gray-400 hover:text-movet-red">
              <FontAwesomeIcon
                icon={faHome}
                className="flex-shrink-0 h-5 w-5"
                aria-hidden="true"
              />
              <span className="sr-only">Home</span>
            </div>
          </Link>
        </li>
        {pages.map((page: any) => (
          <li key={page.name}>
            <Link href={page.href}>
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="flex-shrink-0 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span
                  className={
                    page.current
                      ? "ml-4 text-sm text-movet-black cursor-default font-bold italic"
                      : "ml-4 text-sm font-medium text-movet-black hover:text-movet-red"
                  }
                >
                  {page.name}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
