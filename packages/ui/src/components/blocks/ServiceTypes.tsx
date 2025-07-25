import Image from "next/image";
import { Carousel } from "../elements/Carousel";

const services: {
  name: string;
  description: string;
  icon: string;
  image: string;
}[] = [
  {
    name: "Housecalls",
    description:
      "We’ll come to you! Avoid the carrier or kennel and keep your pet relaxed at home. Our vet techs can provide all the same services we provide in the clinic, delivered to your door. A housecall fee of $60 applies.",
    icon: "/images/icons/mobile.svg",
    image: "/images/pets/clinic-1.png",
  },
  {
    name: "In-Clinic Appointments",
    description:
      "Come visit us at our Belleview Station location! Appointments are encouraged, but walk-ins are welcome if the walk-in sign is out. Our calming ambiance is designed to feel just like your living room.",
    icon: "/images/icons/clinic.svg",
    image: "/images/pets/holding-dog-home.png",
  },

  {
    name: "Telehealth",
    description:
      "Book a virtual appointment! We can do both triage and telemedicine via video chat. Triage is general advice with no diagnosis or prescription given. Telemedicine is diagnosis and prescription for nonemergency conditions.",
    icon: "/images/icons/telehealth.svg",
    image: "/images/pets/telehealth-puppy.png",
  },
];

export const ServiceTypes = () => (
  <section className="relative pt-8 w-full bg-movet-tan sm:bg-movet-white">
    <div className="relative z-10 -mt-2">
      <h2 className="px-4 pt-32 mb-8 text-3xl font-extrabold tracking-tight text-center sm:text-4xl text-movet-black sm:pt-0">
        Moving Pet Care Forward
      </h2>
      <div className="flex flex-col justify-center mx-auto mt-4 mb-12 max-w-screen-lg sm:flex-row sm:mb-16">
        {services.map((service) => (
          <div
            className="flex flex-col py-4 w-full text-center sm:py-0 sm:mx-8"
            key={service.name}
          >
            <div className="mx-auto">
              <Image
                src={service.icon}
                alt={`${service.name} icon`}
                width={112}
                height={112}
              />
            </div>
            <p className="m-0 text-xl font-bold text-center sm:mt-2">
              {service.name}
            </p>
          </div>
        ))}
      </div>
    </div>
    <div className="relative">
      <div className="hidden absolute -top-14 -left-1/4 w-3/5 sm:block bg-movet-white">
        <svg
          className="w-full h-full fill-current text-movet-tan"
          viewBox="0 0 200 250"
        >
          <path d="M 142.746,1.6976344 C 216.82933,-8.8856966 195.66266,81.072633 174.74814,112.75921 164.28341,128.61384 150.6835,136.63513 142.746,157.8018 134.8085,178.96847 132.16266,221.30179 84.537664,223.94763 -24.008904,235.65242 -26.29919,-36.671527 68.662664,4.3434674 105.70433,17.572634 108.35016,6.9893014 142.746,1.6976344" />
        </svg>
      </div>
    </div>
    <div className="relative z-20 pb-12 mt-16 sm:pb-8 sm:px-8 sm:max-w-screen-lg sm:mx-auto">
      <div className="flex relative flex-col items-center -mt-8 w-full sm:mt-0">
        <div className="w-full">
          <div className="hidden sm:block">
            <Carousel
              name="services"
              customClasses={{
                slideContainer: "w-3/4",
              }}
              slideLabels={services.map((serviceStyle) => serviceStyle.name)}
              slideImages={services.map((service) => service.image)}
            >
              {services.map((serviceStyle: any) => (
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
              slideLabels={services.map((serviceStyle) => serviceStyle.name)}
            >
              {services.map((serviceStyle: any) => (
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
    </div>
    <div className="sm:hidden curve before:ellipse-1 before:bg-movet-tan before:translate-x-[-7%] before:translate-y-[30%] after:ellipse-1 after:bg-movet-white after:translate-x-[85%] after:translate-y-[70%]"></div>
  </section>
);
