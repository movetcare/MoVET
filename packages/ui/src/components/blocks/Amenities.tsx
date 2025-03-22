import { IconName } from "@fortawesome/fontawesome-svg-core";
import Image from "next/image";
import { Carousel } from "../elements/Carousel";
const amenities: {
  name: string;
  description: string;
  icon: IconName;
  image: string;
}[] = [
  {
    name: "Pharmacy",
    description:
      "Discuss and pick up your medication with an informed team member in our up-front, transparent veterinary pharmacy. Competitive pricing. Compounding available!",
    icon: "mortar-pestle",
    image: "/images/icons/pharmacy.svg",
  },
  {
    name: "Self-Serve Dog Wash",
    description:
      "Our bathing station takes the hassle out of washing your dog. Find everything you need, including shampoo, brushes, and towels. First come, first serve, Leave the bath cleanup to us!",
    icon: "dog",
    image: "/images/icons/dog-wash.png",
  },
  {
    name: "Vet-Approved Boutique",
    description:
      "Skip the big-box pet store and head to our local, woman-owned boutique. Bring your furry friend and browse our exclusively curated and sourced goods for a Mile High lifestyle. All tested by our Chief Merchandising Officer, Nessie.",
    icon: "store",
    image: "/images/icons/boutique.svg",
  },
];
export const Amenities = () => (
  <section className="relative z-30 my-12 sm:px-8 sm:max-w-screen-lg sm:mx-auto">
    <div className="flex flex-col mx-4 -mt-2 sm:mb-16">
      <h2 className="text-3xl font-extrabold tracking-tight text-center sm:text-4xl text-movet-black">
        Additional Amenities
      </h2>
      <p className="w-full text-lg text-center">
        Available at our <span className="font-extrabold">NEW</span> Belleview
        Station location
      </p>
      <a
        href="https://goo.gl/maps/bRjYuF66CtemGSyq8"
        target="_blank"
        className="text-center hover:underline text-movet-brown"
        rel="noreferrer"
      >
        4912 S Newport St, Denver CO 80237
      </a>
      <div className="flex flex-col justify-center mx-auto mt-4 mb-12 max-w-screen-lg sm:flex-row sm:mb-16">
        {amenities.map((service) => (
          <div
            className="flex flex-col py-4 w-full text-center sm:py-0 sm:mx-8"
            key={service.name}
          >
            <div className="mx-auto">
              <Image
                width={112}
                height={112}
                src={service.image}
                alt={`${service.name} icon`}
              />
            </div>
            <p className="m-0 text-xl font-bold text-center sm:mt-2">
              {service.name}
            </p>
          </div>
        ))}
      </div>
    </div>
    <div className="flex flex-col mt-12 -mb-4 sm:flex-row sm:-mt-12">
      <div className="flex relative z-20 flex-col items-center -mt-8 sm:w-7/12">
        <div className="w-full">
          <div className="hidden sm:block">
            <Carousel
              name="services"
              infinite={false}
              customClasses={{
                slideContainer: "w-3/4",
              }}
              slideLabels={amenities.map((serviceStyle) => serviceStyle.name)}
            >
              {amenities.map((serviceStyle: any) => (
                <div key={serviceStyle.name}>
                  <h3 className="text-2xl tracking-wide">
                    {serviceStyle?.name}
                  </h3>
                  <p className="my-3 text-lg tracking-tight">
                    {serviceStyle?.description}
                  </p>
                </div>
              ))}
            </Carousel>
          </div>
          <div className="sm:hidden">
            <Carousel
              name="services"
              infinite={true}
              autoScroll
              interval={10000}
              customClasses={{
                slideContainer: "w-80",
              }}
              slideLabels={amenities.map((serviceStyle) => serviceStyle.name)}
            >
              {amenities.map((serviceStyle: any) => (
                <div key={serviceStyle.name}>
                  <h3 className="text-2xl tracking-wide">
                    {serviceStyle?.name}
                  </h3>
                  <p className="my-3 text-base tracking-tight">
                    {serviceStyle?.description}
                  </p>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center w-full">
        <div className="mt-4 w-full max-w-xs h-fit sm:mt-0">
          <video controls className="w-full rounded-xl">
            <source
              src="/videos/movet-clinic-virtual-tour.mov"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </div>
  </section>
);
