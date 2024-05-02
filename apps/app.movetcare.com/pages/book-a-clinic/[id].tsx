import { AppHeader } from "components/AppHeader";
import { ClinicSignUpStepOne } from "components/clinic/ClinicSignUpStepOne";
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import { useSearchParams } from "next/navigation";
import { getClinicConfig } from "server";
import { ClinicConfig } from "types";

export const getStaticPaths = (async () => ({
  paths: await getClinicConfig({ id: "all" }),
  fallback: false,
})) satisfies GetStaticPaths;

export const getStaticProps = (async (context) => ({
  props: {
    clinicConfig: await getClinicConfig({ id: context.params?.id as string }),
  },
})) satisfies GetStaticProps<{
  clinicConfig: ClinicConfig;
}>;

export default function PopUpClinic({
  clinicConfig,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  console.log("email", email);
  const patientOne = searchParams.get("patientOne");
  console.log("patientOne", patientOne);
  const patientTwo = searchParams.get("patientTwo");
  console.log("patientTwo", patientTwo);
  const patientThree = searchParams.get("patientThree");
  console.log("patientThree", patientThree);
  const mode = searchParams.get("mode");
  const isAppMode = mode === "app";

  return (
    <section className="w-full flex-1">
      <AppHeader />
      <div
        className={`flex items-center justify-center bg-white rounded-xl max-w-xl mx-auto${
          !isAppMode ? " p-4 mb-4 sm:p-8" : ""
        }`}
      >
        <div className={isAppMode ? "px-4 mb-8" : ""}>
          {!email ? <ClinicSignUpStepOne config={clinicConfig} /> : null}
        </div>
      </div>
    </section>
  );
}
