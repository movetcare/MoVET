import { admin, throwError, DEBUG } from "../../config/config";
import { EmailConfiguration } from "../../types/email.d";
import { sendNotification } from "../sendNotification";

export const sendWelcomeEmail = async (
  email: string,
  withResetLink = false,
): Promise<void> => {
  let emailText = `
      <p>Hi there!</p>
      <p>I'm Lexi, CEO and founder of MoVET Pet Care Services. I am pleased to welcome you to MoVET and I will do my best to make sure your experience with us exceeds your expectations.</p>`;

  if (withResetLink) {
    const link = await admin
      .auth()
      .generatePasswordResetLink(email)
      .catch((error: any) => throwError(error));
    if (DEBUG) console.log("PASSWORD RESET LINK", link);
    emailText += `
      ${
        withResetLink
          ? `<p>If you haven't already, you can download our mobile app for <a href="https://apps.apple.com/us/app/movet-on-demand-vet-services/id1478031556">iOS</a> and <a href="https://play.google.com/store/apps/details?id=com.movet&hl=en_US&gl=US">Android</a>.</p><p>You may start using MoVET's services once you confirm your account and set a password via the link below:</p><p><b><a href="${link}">Verify My MoVET Account</a></b></p>`
          : ""
      }`;
  }

  emailText += `<p>At MoVET, we are passionate about pets! We are a veterinary clinic that serves the Greater Denver area and offers routine care only because we believe prevention and wellness are the foundation of our relationship with our owners and their pets. Because of this, we go the extra mile and offer a truly unique, concierge experience for each and every one of our clients and their pets. Clients can have appointments in their home or in our clinic (designed to look just like your living room). They can also address issues via telemedicine or just chat & get advice with virtual demos. Clients can discuss their pet's medication with an informed team member in our up-front, transparent veterinary pharmacy, and can shop in our high-end veterinary-approved boutique, even equipped with a self-washing dog bath station, where pampering is a must! Healthcare is so much more for us, it's personal.</p>
      <p>It's important to point out up front that we are not a full-service veterinary service. While great for some, we understand it's not always the best fit for others. We do not perform end-of-life veterinary care, nor do we perform anesthetic procedures, such as surgery or dentals, but will partner with you to make the best recommendation for you that fits your needs with a local practice or specialist in town who can help. We pride ourselves on being available to you - either in your home or even better, for a virtual consultation, with our knowledgeable veterinary team.</p>
      <p><b>Here's a small sampling of our most common charges:</b></p>
      <ul>
      <li>Housecall fee - $60/trip</li>
      <li>Establish Care Consult/Exam - $85/pet</li>
      <li>Annual Veterinary Examination - $68/pet</li>
      <li>Nurse Visit - $45</li>
      <li>Telehealth Appointment - $32 - $50</li>
      <li>Vaccines (1 year) - $25 ea.</li>
      <li>Vaccines (3 year) - $35 ea.</li>
      <li>Annual Heartworm Blood Test - $40 </li>
      <li>Heartworm & Intestinal parasite monthly preventative chews (cost varies by weight - 6 mo. and 12 mo. options available)</li>
      <li>(other charges will vary based on diagnostics, medications, etc.)</li>
      </ul>
      <p><b>Additional Pampering:</b></p>
      <ul>
      <li>Nail Trim: $18</li>
      <li>Anal Gland expression: $25</li>
      <li>Ear Cleaning: $25</li>
      <li>Microchip: $60</li>
      </ul>
    <p>I invite you to become part of our family and grow with us! Should you have any questions, concerns, or recommendations for us to improve your experience with MoVET, please email me directly at lexi.abramson@movetcare.com.</p><p>- Dr. A</p>`;

  const emailConfig: EmailConfiguration = {
    to: email,
    subject: withResetLink
      ? "Welcome to MoVET Pet Care - Please Verify Your Account"
      : "Welcome to MoVET Pet Care!",
    message: emailText,
  };

  sendNotification({
    type: "email",
    payload: {
      client: await admin
        .auth()
        .getUserByEmail(email)
        .then((userRecord: any) => userRecord?.uid)
        .catch(() => false),
      ...emailConfig,
    },
  });
};
