import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment, ReactNode, useState } from "react";
import { classNames } from "../../utils";
import { AppLinks } from "../elements";

export const kindsOfService = [
  {
    name: "Primary Care & Minor Illnesses",
    description:
      "Our routine care for peak-of-life pets covers all their preventative health needs. We do annual wellness checkups, customized vaccine schedules, customized nutrition plans, heartworm testing and prevention. dental care advice and exams, and weight management. We can also address minor illnesses* and help with observation for chronic illnesses like diabetes and arthritis.",
  },
  {
    name: "Juvenile & Senior Pet Care",
    description:
      "Whether your pet is at the very beginning or the tailend of their lifespan, we can provide the age-appropriate primary care they need. For puppies and kittens, we offer packages and a la carte services for nutrition advice, vaccinations and boosters, spay/neuter advice, oral care, training, microchipping, parasite control, grooming, and exercise. For senior cats and dogs, our annual checks will be tailored toward your pet’s advancing years.",
  },
  {
    name: "Telehealth & Virtual Care",
    description:
      "Get the app, get in touch! Our app-supported telehealth portal gives you access to chat with a vet or nurse. You can also schedule video appointments to get your pet looked at from the comfort of your living room. By video, we can do initial meet & greets, triage (assessment and advice), telemedicine (where we can diagnose, treat, and prescribe), post-surgical follow-ups, rechecks, and virtual coaching.",
  },
  {
    name: "Concierge & Specialty Services",
    description:
      "We dig deeper than primary care. At housecalls and in-clinic appointments, we can do sample collection and laboratory services, imaging services such as ultrasound and radiology, and cryotherapy. Consider us your pet wellness concierge. Through our app, we’ll connect you to personalized and convenient appointments through our clinic, your home, or your screen. Don’t wait for answers. We’ll have you feeling waited upon instead.",
  },
  {
    name: "What We Don’t Do",
  },
];

export const nonServices = [
  {
    name: "Emergency & Urgent Care",
    description:
      "As primary care providers, our clinic is not set up for emergency care. Please seek a veterinary hospital with emergency care for any of the following: profuse bleeding, breathing difficulties, fainting or collapse, discolored or pale gums, heat stroke, choking or excessive coughing, bite wounds, ingestion of toxins, major traumatic injuries such as broken bones or lacerations, allergic reactions or snake bites.",
  },
  {
    name: "Surgical Procedures",
    description:
      "To help keep our overhead costs down and, in turn, our prices down, we do not have surgical capacity in our clinic. The most commonly requested procedures are large mass removals, spays, and neuters. While we don’t perform these procedures ourselves, we can refer you to nonprofit shelters who can perform them affordably for patients or trusted full service veterinary practices in town.",
  },
  {
    name: "Anesthetic Treatment",
    description:
      "While we can do some localized anesthesia for small mass removals, we don’t perform general anesthesia for procedures such as dental services. We do, however, provide professional dental cleanings quarterly*. Have a vet-anxious pet? Ask us about our FREE Happy Visits. We’ll discuss options such as anxiolytics and/or supplements to help make your pet’s visit more comfortable.",
    note: "* Not a substitution for anesthetic dentals.",
  },
  {
    name: "Specialist Services",
    description:
      "Just like primary care providers for humans, we make referrals to partner specialist hospitals or practices  when needed. We have an amazing network of veterinary ophthalmologists, dermatologists, neurologists, radiologists, and oncologists who provide specialist care. Also note that we don’t perform euthanasia, but we can connect you to our preferred providers who match our own level of compassion for your animal family members.",
  },
];

export const virtualConsultations = [
  "New Client Meet & Greets",
  "Preventative Care & Wellness Advice",
  "Limping-Sudden Onset",
  "Urinary Issues-Female Pets Only",
  "Diarrhea-Starting in the last 2-3 days",
  "Hospice / End of Life Care",
  "Coughing-Starting in the last 72 hours",
  "Respiratory Infections-Cats Only",
  "Behavioral Issues",
  "Skin Issues / Rashes / Biting / Licking",
  "Vomiting-Chronic morning or bile vomiting",
  "Ear Infection-No known exposure to fox tails",
  "Diet / Nutrition Consultation",
  "Follow-up Exams & Monitoring",
  "Post Surgical Recheck",
  "Holistic Care",
];

export const minorIllnessCare = [
  "Change in Behavior",
  "Behavior concerns",
  "Weight gain/loss",
  "Recent Coughing",
  "Dental Exams",
  "Cuts/scrapes",
  "Limping/Ortho concern",
  "GI Concerns",
  "Vomiting bile or food",
  "Diarrhea (2-5 days)",
  "Ear Infections",
  "Eye Infections",
  "Lumps, bumps or growths",
  "Skin Issues",
  "Itching/Allergies",
  "Respiratory Infections",
  "Urinary Infections",
];

export const Services = ({
  backgroundColor = null,
  withTitle = true,
}: {
  backgroundColor?: null | "white";
  withTitle?: boolean;
}) => {
  const router = useRouter();
  const [activeService, setActiveService] = useState(0);
  const getColorClassName = (color: "red" | "white") => {
    switch (color) {
      case "red":
        return "bg-movet-red";
      case "white":
        return "bg-white";
    }
  };
  const rem = (n: number) => n + "rem";
  const PaddedBackground = ({
    children,
    className,
    color = "red",
    size = "sm",
  }: {
    children: ReactNode;
    color?: "red" | "white";
    className?: string;
    size?: "sm" | "md" | "lg";
  }) => {
    const sizeVal = size === "sm" ? 0.5 : size === "md" ? 1 : 2;
    return (
      <div
        className={classNames(
          className as string,
          getColorClassName(color),
          "relative",
        )}
      >
        <div
          className="padded-background-border w-full"
          style={{ height: rem(sizeVal), top: rem(-sizeVal / 2) }}
        ></div>
        <div
          className="padded-background-border h-full"
          style={{ width: rem(sizeVal), right: rem(-sizeVal / 2) }}
        ></div>
        <div
          className="padded-background-border w-full"
          style={{ height: rem(sizeVal), bottom: rem(-sizeVal / 2) }}
        ></div>
        <div
          className="padded-background-border h-full"
          style={{ width: rem(sizeVal), left: rem(-sizeVal / 2) }}
        ></div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  };
  const BreakText = ({
    text,
    breaker,
    removeBreaker = false,
  }: {
    text: string;
    breaker: string;
    removeBreaker?: boolean;
  }) => {
    const textComps = text.split(breaker);
    return (
      <>
        {textComps.map((line, i) => (
          <Fragment key={i}>
            {line.trim()}
            {i < textComps.length - 1 && (
              <>
                {!removeBreaker && " " + breaker}
                <br />
              </>
            )}
          </Fragment>
        ))}
      </>
    );
  };
  return (
    <section className="relative mb-20">
      {router.route === "/services" && withTitle ? (
        <h2 className="text-4xl text-center my-8">Services</h2>
      ) : withTitle ? (
        <h2 className="text-3xl sm:text-4xl text-center font-extrabold tracking-tight text-movet-black mt-8">
          Our Services
        </h2>
      ) : (
        <div className="mt-8"></div>
      )}
      <div
        className={`flex flex-col sm:flex-row sm:max-w-screen-lg py-8 lg:px-8 relative z-20 text-lg mx-auto${
          backgroundColor !== null ? " bg-white rounded-lg" : ""
        }`}
      >
        <div className="w-min self-center sm:self-start mb-8 sm:mb-0">
          {kindsOfService.map((service: any, i: number) => {
            return activeService === i ? (
              <PaddedBackground className="mb-2" key={service.name}>
                <button
                  className="text-movet-white text-lg font-abside text-center w-full whitespace-nowrap py-2 px-4"
                  onClick={() => setActiveService(i)}
                >
                  <BreakText text={service.name} breaker="&" />
                </button>
              </PaddedBackground>
            ) : (
              <button
                key={service.name}
                className="text-lg py-2 px-4 text-center font-abside w-full mb-2 whitespace-nowrap hover:text-movet-red ease-in-out duration-500"
                onClick={() => setActiveService(i)}
              >
                <BreakText text={service.name} breaker="&" />
              </button>
            );
          })}
        </div>
        <div className="w-full px-8 sm:pr-0 sm:pl-10">
          <Transition
            show={activeService === 0}
            enter="transition ease-in duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            <h3 className="text-2xl text-movet-red font-bold">
              {kindsOfService[activeService].name}
            </h3>
            <div>
              <div>
                <p>{kindsOfService[0].description}</p>
                <p>
                  <span className="italic font-bold mr-2 text-lg">
                    New Pet or First-Time Pet Owner?
                  </span>
                  Let&apos;s set you up for success! We&apos;ll help make sure
                  that the pet you want will be a good fit for you and your
                  lifestyle.
                </p>

                <ul className="list-disc list-inside ml-6 leading-8 mt-4">
                  <li>Appropriate breed selection based on lifestyle</li>
                  <li>Prep your house</li>
                  <li>Training techniques/recommendations</li>
                  <li>Nutritional recommendations</li>
                  <li>Common breed-specific health issues</li>
                </ul>
              </div>
            </div>
          </Transition>
          <Transition
            show={activeService === 1}
            enter="transition ease-in duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            <h3 className="text-2xl text-movet-red font-bold">
              {kindsOfService[activeService].name}
            </h3>

            <div>
              <div>
                <p>{kindsOfService[1].description}</p>
              </div>
              <div className="mt-4 mb-2 text-lg italic">
                Minor illness care includes: <br className="sm:hidden" />
                <span className="italic font-medium sm:pl-8 text-sm">
                  (*for established patients)
                </span>
              </div>
              <div className="w-full mt-6">
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4 my-list text-lg leading-6 list-disc list-inside">
                  {minorIllnessCare.map((minorIllness: any) => (
                    <li key={minorIllness}>{minorIllness}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Transition>
          <Transition
            show={activeService === 2}
            enter="transition ease-in duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            <h3 className="text-2xl text-movet-red font-bold">
              {kindsOfService[activeService].name}
            </h3>
            <div>
              <div>
                <p>{kindsOfService[2].description}</p>
                <p>
                  <span className="italic mr-2 text-lg">
                    What&apos;s Virtual Coaching?
                  </span>
                  We&apos;ll coach you on how to perform nail trims, clean your
                  pet&apos;s ears, what to expect in your pet&apos;s first year,
                  first time pet ownership 101, how to brush your pet&apos;s
                  teeth, and even review a chronic illnesses, such as Diabetes
                  and how to give insulin to your diabetic pet. All with our
                  virtual veterinary coaches to help you along and build
                  confidence!
                </p>
              </div>
              <p className="italic text-lg">
                When can you schedule a Virtual Consultation?
              </p>
              <div className="w-full mt-6">
                <ul className="grid grid-cols-2 gap-x-4 gap-y-4 my-list leading-6 list-disc list-inside">
                  {virtualConsultations.map((consultation: any) => (
                    <li key={consultation}>{consultation}</li>
                  ))}
                </ul>
              </div>
              {router?.query?.mode !== "app" && (
                <div className="flex flex-col justify-center items-center mt-8">
                  <p className="mb-3 font-abside text-sm text-center">
                    START A TELEHEALTH SESSION TODAY
                  </p>
                  <div className="flex justify-center">
                    <AppLinks />
                  </div>
                </div>
              )}
            </div>
          </Transition>
          <Transition
            show={activeService === 3}
            enter="transition ease-in duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            <h3 className="text-2xl text-movet-red font-bold">
              {kindsOfService[activeService].name}
            </h3>

            <div>
              <p> {kindsOfService[3].description}</p>
            </div>
          </Transition>
          <Transition
            show={activeService === 4}
            enter="transition ease-in duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            <h3 className="text-2xl text-movet-red font-bold">
              {kindsOfService[activeService].name}
            </h3>
            <div>
              <p className="font-bold mb-4">
                There are some diagnostic tests and procedures that require
                anesthesia, a specialist, or just more hands!
              </p>
              {nonServices.map((nonService: any) => (
                <div key={nonService.name}>
                  <div className="font-bold text-lg">{nonService.name}</div>
                  <p
                    className={classNames((!nonService.note as any) && "mb-4")}
                  >
                    {nonService.description}
                  </p>
                  {nonService.note && (
                    <div className="text-xs italic text-right w-full my-4 md:mb-0">
                      {nonService.note}
                    </div>
                  )}
                </div>
              ))}
              <p className="font-extrabold italic text-lg mt-4">
                All of our vets work with a local partner practice to provide an
                excellent continuity for care in the event that your pet should
                require surgery or more in depth diagnostics. When necessary
                we&apos;ll refer you to the partner practice or specialty
                hospital who is well set up to do any surgery or emergency care
                that your pet should need. MoVET will help manage the process.
              </p>
            </div>
          </Transition>
        </div>
      </div>
      <div className="curve hidden md:bottom-8 before:md:h-24 after:md:h-24 before:bg-movet-white before:translate-x-[-6%] before:translate-y-[29%] after:bg-movet-red after:translate-x-[78%] after:translate-y-[70%] after:w-[60%]"></div>
    </section>
  );
};
