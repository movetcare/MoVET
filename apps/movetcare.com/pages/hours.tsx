import { CallToAction, Hours } from "ui";
import Head from "next/head";
import Layout from "components/Layout";
import type {
  WinterMode as WinterModeType,
  Closures as ClosuresType,
  Hours as HoursType,
  HoursStatus as HoursStatusType,
} from "types";
import { getWinterMode, getClosures, getHours, getHoursStatus } from "server";

export async function getStaticProps() {
  return {
    props: {
      winterMode: (await getWinterMode()) || null,
      closures: (await getClosures()) || null,
      hours: (await getHours()) || null,
      hoursStatus: (await getHoursStatus()) || null,
    } as any,
  };
}

export default function HoursPage({
  winterMode,
  closures,
  hours,
  hoursStatus,
}: {
  winterMode: WinterModeType;
  closures: Array<ClosuresType>;
  hours: Array<HoursType>;
  hoursStatus: HoursStatusType;
}) {
  return (
    <Layout>
      <Head>
        <title>Hours of Operation</title>
      </Head>
      <Hours winterMode={winterMode} hours={hours} hoursStatus={hoursStatus} />
      {closures && (closures as any)?.length > 0 && (
        <section className="w-full pb-6 -mt-4">
          <div className="relative z-20 px-4 sm:px-8 max-w-screen-lg mx-auto">
            <div className="mb-8 p-8 rounded-xl bg-white">
              <div className="w-full max-w-lg mx-auto">
                <h3 className="text-xl text-center font-bold">
                  Seasonal Closures
                </h3>
                {closures.map((closure: ClosuresType, index: number) => (
                  <div
                    className="flex flex-col sm:flex-row py-4 px-2 sm:px-4 leading-6 font-abside text-lg pb-2 whitespace-nowrap"
                    key={index}
                  >
                    <div className="w-full">
                      <div className="flex w-full">
                        {/* <span className="mx-2">
                          {closure?.isActiveForClinic && (
                            <FontAwesomeIcon
                              title="Clinic Closed"
                              size="sm"
                              icon={faHospital}
                              className="mr-2"
                            />
                          )}
                          {closure?.isActiveForHousecalls && (
                            <FontAwesomeIcon
                              title="Housecalls Closed"
                              size="sm"
                              icon={faHouseMedical}
                            />
                          )}
                          {closure?.isActiveForTelehealth && (
                            <FontAwesomeIcon
                              title="Telehealth Closed"
                              size="sm"
                              icon={faHeadset}
                              className="ml-2"
                            />
                          )}
                        </span> */}
                        <span className="whitespace-nowrap">
                          {closure.name}
                        </span>
                        <div className="w-full border-b mb-2 mx-4 hidden sm:block"></div>
                      </div>
                    </div>
                    <div className="w-max whitespace-nowrap">
                      <p className="m-0">
                        {closure?.startDate !== closure?.endDate
                          ? `${closure?.startDate} - ${closure?.endDate}`
                          : closure?.startDate}{" "}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      <CallToAction />
    </Layout>
  );
}
