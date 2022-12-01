import Image from 'next/image';
import { useRouter } from 'next/router';

export const AppHeader = () => {
  const router = useRouter();
  const { mode } = router.query;
  return mode !== "app" ? (
    <div
      className="py-8 text-center"
      onClick={() =>
        router.asPath.includes("success") || router.asPath.includes("cancel")
          ? router.replace("/")
          : router.reload()
      }
    >
      <Image
        src="/images/logos/logo.png"
        className="mx-auto"
        width={190}
        height={60}
        alt="MoVET Logo"
        priority
      />
      <h3 className="first-letter:tracking-wide text-lg sm:text-xl my-1">
        Your neighborhood vet,
      </h3>
      <h3 className="text-lg sm:text-xl text-movet-red">Delivered</h3>
    </div>
  ) : (
    <></>
  );
};
