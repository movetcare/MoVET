import Image from 'next/image';
import { useRouter } from 'next/router';

export const AppHeader = () => {
  const router = useRouter();
  const { mode } = router.query;
  return mode !== 'app' ? (
    <section className="flex w-full">
      <div className="flex flex-col justify-center py-8 mx-auto text-center">
        <Image
          src="/images/logos/logo.png"
          className="mx-auto -mt-4"
          width={290}
          height={80}
          alt="MoVET Logo"
        />
        <h3 className="first-letter:tracking-wide text-xl  sm:text-2xl mb-1.5 mt-4">
          Your neighborhood vet,
        </h3>
        <h3 className="text-xl sm:text-2xl text-movet-red">Delivered</h3>
      </div>
    </section>
  ) : (
    <></>
  );
};
