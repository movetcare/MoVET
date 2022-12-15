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
    <div className="-mt-2 sm:mb-16 flex flex-col mx-4">
      <h2 className="text-3xl sm:text-4xl text-center font-extrabold tracking-tight text-movet-black">
        Additional Amenities
      </h2>
      <p className="text-lg w-full text-center">
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
      <div className="flex flex-col sm:flex-row mx-auto justify-center mt-4 mb-12 sm:mb-16 max-w-screen-lg">
        {amenities.map((service) => (
          <div
            className="w-full py-4 sm:py-0 sm:mx-8 text-center"
            key={service.name}
          >
            <div className="w-36 h-32 sm:w-28 sm:h-24 mx-auto hover:animate-bounce duration-500">
              <Image
                width={112}
                height={112}
                src={service.image}
                alt={`${service.name} icon`}
              />
            </div>
            <p className="text-center text-xl -mt-4 sm:mt-2 font-bold">
              {service.name}
            </p>
          </div>
        ))}
      </div>
    </div>
    <div className="flex flex-col sm:flex-row mt-12 sm:-mt-12 -mb-4">
      <div className="w-full sm:w-7/12 flex flex-col items-center relative z-20 -mt-8">
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
                  <p className="text-lg my-3 tracking-tight">
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
                  <p className="text-base my-3 tracking-tight">
                    {serviceStyle?.description}
                  </p>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        <div className="max-w-xs h-fit w-full mt-4 sm:mt-0">
          <video controls className="rounded-xl w-full">
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
