import Layout from "components/Layout";
import Head from "next/head";

export default function FrontDeskListing() {
  return (
    <Layout>
      <Head>
        <title>
          Front Desk Veterinary Medical Receptionist & Retail Sales Associate
        </title>
      </Head>
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto text-center mt-8 mb-20 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <h2 className="text-2xl mb-4">
          Front Desk Veterinary Medical Receptionist & Retail Sales Associate
        </h2>
        <div className="w-full text-left">
          <p>
            Combine your love for the human-animal bond with a dynamic role at
            MoVET. We seek an outgoing, tech-savvy, and proactive individual who
            excels in customer interaction and team collaboration. Technical
            abilities and strong writing skills are paramount in this role.
          </p>
          <p>
            We are seeking candidates who desire a FLEXIBLE SCHEDULE and can
            work some of the listed days/hours, especially afternoon shifts
            (noon to closing).
          </p>
          <h5 className="mt-8 mb-2 text-base font-extrabold text-left">
            Key Responsibilities
          </h5>
          <ul className="list-disc ml-8 my-4">
            <li>
              Greet clients and manage the front desk with a friendly and
              professional demeanor.
            </li>
            <li>
              Assist customers in our pet boutique, providing expert advice on
              veterinary-approved products.
            </li>
            <li>
              Handle sales transactions, process credit card payments, and
              manage inventory.
            </li>
            <li>
              Maintain the self-serve dog washing station, ensuring it is clean
              and ready for the next client.
            </li>
            <li>
              Schedule appointments, respond to inquiries, and manage
              communication via calls, SMS, email, and our app.
            </li>
            <li>
              Support marketing efforts, including coordinating special events
              and promoting our services.
            </li>
          </ul>
          <h5 className="mt-8 mb-2 text-base font-extrabold text-left">
            Qualifications
          </h5>
          <ul className="list-disc ml-8 my-4">
            <li>Passion for pets and helping people.</li>
            <li>
              1 year of experience in veterinary or pet care, customer service,
              or retail sales preferred.
            </li>
            <li>
              Strong technical skills with Mac computers and various software
              tools.
            </li>
            <li>Excellent writing and communication skills.</li>
            <li>
              Ability to multitask effectively and manage multiple open tabs on
              a computer
            </li>
            <li>
              Be honest, trustworthy, and reliable with a positive attitude and
              sense of humor.
            </li>
            <li>
              Ability to lift 50 lbs and stand or walk for extended periods.
            </li>
            <li>
              US work authorization and ability to pass a criminal background
              check.
            </li>
          </ul>
          <h5 className="mt-8 mb-2 text-base font-extrabold text-left">
            Benefits
          </h5>
          <ul className="list-disc ml-8 my-4">
            <li>Competitive hourly wage starting at $18.29+.</li>
            <li>15% discount on boutique merchandise.</li>
            <li>Significant savings on bath and pampering services.</li>
            <li>Deeply discounted pet medical treatment for two pets.</li>
            <li>
              Participation in employee feeding programs with major pet food
              brands.
            </li>
            <li>
              Company events, team celebrations, and provided snacks/meals
            </li>
            <li>Flexible schedule with some evening and weekend shifts.</li>
          </ul>
          <p className="text-sm italic">
            * Please note this job description is not designed to cover or
            contain a comprehensive listing of activities, duties, or
            responsibilities that are required of the employee for this job.
            Duties, responsibilities, and activities may change at any time with
            or without notice.
          </p>
          <p>
            To apply, send an email to{" "}
            <a
              href="mailto://admin@movetcare.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline  ease-in-out duration-500 text-movet-brown italic"
            >
              admin@movetcare.com
            </a>{" "}
            with “Front Desk Veterinary Medical Receptionist & Retail Sales
            Associate” in the subject line. Include a resume and a cover letter
            describing your current and past experience and why you think you
            would be a good fit for the position.
          </p>
        </div>
      </section>
    </Layout>
  );
}
