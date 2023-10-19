import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useRouter } from "next/router";

export const TermsAndConditions = () => {
  const router = useRouter();
  const { mode } = router.query;
  return (
    <>
      <Head>
        <title>Terms & Conditions</title>
      </Head>
      <section className="max-w-screen-lg bg-white rounded-xl p-4 sm:p-8 mx-4 sm:mx-auto my-4 sm:m-8">
        {mode !== "app" && (
          <div
            className="flex flex-row justify-center items-center my-4 cursor-pointer"
            onClick={() => router.back()}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <p className="ml-2">Go Back</p>
          </div>
        )}
        <h1>Terms of Service</h1>
        <p>
          Please read these Terms of Service (the &quot;Agreement&quot;)
          carefully, as they contain the legal terms and conditions that govern
          your use and access of the website, movetcare.com (the
          &quot;Site&quot;) and the MoVET applications, online and in-person
          services (collectively with the Site, the &quot;Services&quot;). This
          Agreement governs your use of the Services and constitutes a
          legally-binding agreement between each user (&quot;you,&quot;
          &quot;your,&quot; &quot;user&quot;) and MoVET, Inc. (“MoVET,”
          &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). If you do not
          agree to the terms of this Agreement, you may not access MoVET or use
          our Services. If you have any questions about this Agreement please
          contact us at info@movetcare.com.
        </p>
        <h2>1. Revision Of This Agreement</h2>
        <p>
          Please note that we reserve the right to revise and amend this
          Agreement from time to time at our sole discretion. Any changes to
          this Agreement will be posted on our website at
          www.movetcare.com/terms. If you do not agree to any modifications to
          this Agreement, your sole remedy is not to accept the revised
          Agreement and to stop using the Site and Services.
        </p>

        <h2>2. Services</h2>
        <p>
          MoVET is a technology platform that helps connect our users to
          independent veterinary service providers. Our main Services are the
          MoVET house call services, which enables users to arrange and schedule
          &quot;on-site&quot; veterinary services (the &quot;Mobile
          Services&quot;), “in-clinic” veterinary services (the “Clinic
          Services”), and the staffing services, which allows veterinary
          hospitals to hire temporary veterinary service providers (the “Relief
          Services” and together with the Mobile and Clinic Services, the
          “Veterinary Services”).
        </p>

        <h2>3. Acknowledgements</h2>
        <p>
          You acknowledge that independent third-party veterinarians and
          certified veterinary technicians (&quot;Veterinary Experts&quot;), not
          MoVET, provide the Veterinary Services made available through our
          Services. Unless otherwise agreed upon in writing, we will not
          intervene in any relationship that you establish with a Veterinary
          Expert. Notwithstanding the previous sentence, you acknowledge that
          the veterinary medical patient records created in the process of
          receiving the Veterinary Services shall be the property of MoVET; and
          MoVET may share patient records with other Veterinary Experts which
          contract with MoVET and that may provide Veterinary Services to you
          and your pet in the future.
        </p>

        <p>
          We are not responsible for the performance of Veterinary Experts, and
          do not have control over the quality, integrity, actions, or omissions
          of any Veterinary Expert. We also do not have control over: (i) the
          truthfulness or accuracy of any representations made by the Veterinary
          Experts; or (ii) the ability of Veterinary Experts to provide the
          Veterinary Services.
        </p>

        <h2>4. Communications Between Users And Veterinary Experts</h2>
        <p>
          MoVET allows for the communication and sharing of information between
          users and Veterinary Experts to facilitate the use of the Services.
          Like many online services, MoVET contains interactive features and
          areas that allow users to post, transmit, or store text or other
          materials, such as requests for Services and member feedback
          (collectively, “User Content”).
        </p>

        <p>
          When interacting with other users or Veterinary Experts, please
          exercise caution and common sense to protect your personal safety and
          property, just as you would when interacting with other persons that
          you don&apos;t know. Each user should undertake his or her own
          research to be satisfied that a Veterinary Expert is suitable to
          provide the Veterinary Services that you are requesting.
        </p>

        <p>
          If you post User Content to MoVET, post links on our Services, or
          otherwise make (or allow any third party to make) material available
          by means of the Site, you acknowledge that you are solely responsible
          for the User Content and any consequences resulting from the posting
          of this content. We do not verify or approve any posted User Content,
          and material in the form of opinions are not our opinions. You should
          only provide User Content that you have the right to share and are
          comfortable sharing with others, you agree not to upload, post, or
          otherwise transmit any User Content to or through the Services that
          infringes, misappropriates, or otherwise violates any copyright,
          trademark, or other intellectual property right, right of privacy,
          right of publicity, or any other right of any entity or person; or
          that is unlawful, libelous, defamatory, obscene, pornographic, or
          profane, or that could constitute or encourage conduct that would be
          considered a criminal offense. If you violate, or are suspected of
          violating these terms, we reserve the right to remove any and all of
          your User Content.
        </p>

        <h2>5. DISCLAIMER</h2>
        <p>
          ALL CONTENT ON THIS SITE, INCLUDING BUT NOT LIMITED TO, ALL
          INFORMATION, COMMUNICATIONS, BLOG POSTS, NEWS, PRESS RELEASES,
          SOFTWARE, ANALYTICS, (COLLECTIVELY, “CONTENT”), IS PROVIDED TO YOU ON
          AN “AS IS” AND “AS AVAILABLE” BASIS WITHOUT WARRANTY OF ANY KIND
          EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED
          WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT. MoVET MAKES NO WARRANTY AS TO THE ACCURACY,
          COMPLETENESS, CURRENCY, OR RELIABILITY OF ANY CONTENT AVAILABLE
          THROUGH THIS SITE. YOU ARE RESPONSIBLE FOR VERIFYING ANY INFORMATION
          BEFORE RELYING ON IT. USE OF THE SITE AND THE CONTENT AVAILABLE ON THE
          SITE IS AT YOUR SOLE RISK. MoVET MAKES NO REPRESENTATIONS OR
          WARRANTIES THAT USE OF THE SITE WILL BE UNINTERRUPTED OR ERROR-FREE.
          YOU ARE RESPONSIBLE FOR TAKING ALL NECESSARY PRECAUTIONS TO ENSURE
          THAT ANY CONTENT YOU MAY OBTAIN FROM THE SITE IS FREE OF VIRUSES.
        </p>

        <h2>6. LIMITATION OF LIABILITY</h2>
        <p>
          MoVET SPECIFICALLY DISCLAIMS ANY LIABILITY, WHETHER BASED IN CONTRACT,
          TORT, STRICT LIABILITY OR OTHERWISE, FOR ANY DIRECT, INDIRECT,
          INCIDENTAL, CONSEQUENTIAL, OR SPECIAL DAMAGES ARISING OUT OF OR IN ANY
          WAY CONNECTED WITH ACCESS TO OR USE OF THE SITE, EVEN IF MoVET HAS
          BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, INCLUDING BUT NOT
          LIMITED TO RELIANCE BY ANY PARTY ON ANY CONTENT OBTAINED THROUGH THE
          USE OF THE SITE, OR THAT ARISES IN CONNECTION WITH MISTAKES OR
          OMISSIONS IN, OR DELAYS IN TRANSMISSION OF, INFORMATION TO OR FROM THE
          USER, INTERRUPTIONS IN TELECOMMUNICATIONS CONNECTIONS TO THE SITE OR
          VIRUSES, WHETHER CAUSED IN WHOLE OR IN PART BY NEGLIGENCE, ACTS OF
          GOD,
        </p>

        <h2>7. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold MoVET, its directors,
          officers, employees, consultants, agents, and other representatives,
          harmless from and against any and all claims, damages, losses, costs
          (including reasonable attorneys&apos;fees), and other expenses that
          arise directly or indirectly out of or from (a) your breach of this
          Agreement; (b) any allegation that any materials you submit to us
          infringe or otherwise violate the copyright, trademark, trade secret,
          or other intellectual property or other rights of any third party; and
          (c) your activities in connection with or in reliance upon the Site.
        </p>

        <h2>8. License and Ownership</h2>
        <p>
          Any and all intellectual property rights (the “Intellectual Property”)
          associated with the Site and the Content are the sole property of
          MoVET, its affiliates or third parties. The Content is protected by
          copyrights, patents, and other laws in both the United States and
          other countries. Elements of the Site are also protected by trade
          dress, trade secret, unfair competition, and other laws and may not be
          copied or imitated in whole or in part. All custom graphics, icons and
          other items that appear on the Site are trademarks, service marks or
          trade dress (“Marks”) of MoVET, its affiliates or other entities that
          have granted MoVET the right and license to use such Marks and may not
          be used or interfered with in any manner without the express written
          consent of MoVET. Except as otherwise expressly authorized by this
          Agreement, you may not copy, reproduce, modify, lease, loan, sell,
          create derivative works from, upload, transmit or distribute the
          Intellectual Property of the Site in any way without MoVET&apos;s or
          the appropriate third party&apos;s prior written permission. Except as
          expressly provided herein, MoVET does not grant to you any express or
          implied rights to MoVET&apos;s or any third party&apos;s Intellectual
          Property.
        </p>

        <p>
          MoVET grants you a limited, personal, nontransferable,
          nonsublicensable, revocable license to access and use the Site,
          Content and Services only in the manner presented by MoVET. Except for
          this limited license, MoVET does not convey any interest in or to the
          Site, Content, Services or any other MoVET property by permitting you
          to access the Site. Except to the extent required by law or as
          expressly provided herein, none of the Content may be
          reverse-engineered, modified, reproduced, republished, translated into
          any language or computer language, re-transmitted in any form or by
          any means, resold or redistributed without the prior written consent
          of MoVET. You may not make, sell, offer for sale, modify, reproduce,
          display, publicly perform, import, distribute, retransmit or otherwise
          use the Content in any way, unless expressly permitted to do so by
          MoVET.
        </p>

        <p>
          You grant MoVET the right and license to use any and all information
          submitted by you through the Site, including in an anonymized or
          aggregated fashion, subject only to the MoVET&apos;s then current
          privacy policy.
        </p>

        <h2>9. Fees And Billing</h2>
        <p>
          Each user hereby authorizes the collection of the disclosed fees for
          the requested Services by charging the payment method provided as part
          of requesting the Services, either directly by MoVET or indirectly,
          via a third-party online payment processor. If a User is directed to
          MoVET&apos;s third-party payment processor, the user may be subject to
          terms and conditions governing use of that third party&apos;s service
          and that third party&apos;s personal information collection practices.
          Please review such terms and conditions and privacy statement before
          using their services. Users will be liable for any taxes required to
          be paid on the Services (other than taxes on income).
        </p>

        <h2>10. No Veterinary-Client-Patient Relationship</h2>
        <p>
          No Veterinary-Client-Patient Relationship (“VCPR”) with MoVET is
          created by using the Site, Content, or Services, whether such Content
          is provided by or through the use of the Services or through any other
          communications from MoVET including any assistance we may provide to
          help you find an appropriate Veterinary Expert. A VCPR may only be
          established with a licensed veterinarian with sufficient knowledge and
          contact.
        </p>

        <p>
          MoVET makes no guarantees, representations or warranties, whether
          expressed or implied, with respect to the professional qualifications,
          expertise, quality of work, or other information herein regarding
          Veterinary Experts.
        </p>

        <p>
          YOU ACKNOWLEDGE THAT YOU ARE RESPONSIBLE FOR ANY MEDICAL DECISIONS AND
          ENSURING PROPER CARE FROM A VETERINARIAN THAT HAS ESTABLISHED A VCPR
          PURSUANT THE APPLICABLE REGULATIONS.
        </p>

        <h2>11. No Veterinary Advice</h2>
        <p>
          Any information that you obtain or receive from MoVET, and its
          employees, contractors, partners, sponsors, advertisers, licensors or
          otherwise through the Services is for informational, scheduling, and
          payment purposes only.
        </p>

        <p>
          The information provided, whether it is provided by or through the use
          of the Services or through any other communications from MoVET, is not
          intended as a substitute for, nor does it replace, professional
          veterinary advice, diagnosis, or treatment. Do not disregard, avoid,
          or delay obtaining veterinary advice from a qualified veterinary
          professional because of something you may have read through MoVET.
        </p>

        <h2>
          12. You Are Ultimately Responsible For Choosing Your Own Veterinary
          Expert
        </h2>
        <p>
          We may enter into contracts with the Veterinary Experts listed through
          the Services with whom you may schedule appointments, and Veterinary
          Experts may pay us a service fee in order to be marketed through the
          Services. We may provide you with lists and/or profile previews of
          Veterinary Experts who may be suitable to provide the Services you
          seek based on information that you provide to us. But we (i) do not
          recommend or endorse any particular Veterinary Experts; and (ii) do
          not make any representations or warranties with respect to these
          Veterinary Experts or the quality of the services they may provide.
        </p>

        <h2>13. Copyright Policy</h2>
        <p>
          If you believe that your work has been copied and is accessible on the
          Site in a way that constitutes copyright infringement, or that the
          Site contains links or other references to another online location
          that contains material or activity that infringes your copyright
          rights, you may notify us by providing the following information (as
          required by the Online Copyright Infringement Liability Limitation Act
          of the Digital Millennium Copyright Act, 17 U.S.C. sec. 512) to our
          copyright agent set forth below:
        </p>
        <ul>
          <li>
            A physical or electronic signature of the person authorized to act
            on behalf of the owner of an exclusive right that is allegedly
            infringed;
          </li>
          <li>
            Identification of the copyrighted work claimed to have been
            infringed, or if multiple copyrighted works at a single online site
            are covered by a single notification, a representative list of such
            works at that site;
          </li>
          <li>
            Identification of the material that is claimed to be infringing, or
            to be the subject of infringing activity, and that is to be removed
            or access to which is to be disabled, and information reasonably
            sufficient to permit MoVET, or its third-party service providers, to
            locate the material;
          </li>
          <li>
            Information reasonably sufficient to permit MoVET, or its
            third-party service providers, to contact the complaining party,
            such as an address, telephone number, and if available, an
            electronic mail address at which the complaining party may be
            contacted;
          </li>
          <li>
            A statement that the complaining party has a good faith belief that
            use of the material in the manner complained of is not authorized by
            the copyright owner, its agent, or the law; and
          </li>
          <li>
            A statement that the information in the notification is accurate,
            and under penalty of perjury, that the complaining party is
            authorized to act on behalf of the owner of an exclusive right that
            is allegedly infringed.
          </li>
        </ul>
        <h3>Copyright Agent:</h3>
        <p>MoVET, Inc.</p>
        <p>1854 E Lake Drive, </p>
        <p>Littleton, CO 80121 </p>
        <p>720-507-7387</p>

        <p>
          <a href="mailto://info@movetcare.com">info@movetcare.com</a>
        </p>
        <h2>
          14. Right To Terminate Your Account Or Block Access To The Services
        </h2>
        <p>
          We may terminate your account or otherwise prevent you from using the
          Services at our discretion, with or without cause, at any time and
          without notice, and without any liability to you for doing so. If we
          terminate your account, you must immediately stop using the Services
          and you agree not to attempt to regain access to the Services without
          our express permission. Such termination will result in the suspension
          or deletion of your account and access to your account. In the event
          of termination of your account, the provisions of this Agreement shall
          remain in effect.
        </p>

        <h2>15. Entire Agreement; Choice Of Law</h2>
        <p>
          EXCEPT AS EXPRESSLY PROVIDED IN A SEPARATE LICENSE, SERVICE OR OTHER
          WRITTEN AGREEMENT BETWEEN YOU AND MoVET, THESE TERMS OF USE CONSTITUTE
          THE ENTIRE AGREEMENT BETWEEN YOU AND MoVET WITH RESPECT TO THE USE OF
          THE SITE, AND ANY SERVICES, INFORMATION AND CONTENT CONTAINED THEREIN,
          AND SUPERSEDE ALL DISCUSSIONS, COMMUNICATIONS, CONVERSATIONS AND
          AGREEMENTS CONCERNING THE SUBJECT MATTER HEREOF.
        </p>

        <p>
          TO THE FULLEST EXTENT PERMITTED BY LAW, YOU HEREBY EXPRESSLY AGREE
          THAT ANY PROCEEDING ARISING OUT OF OR RELATING TO YOUR USE OF THE
          SITE, THE SERVICES AND CONTENT SHALL BE INSTITUTED IN A STATE OR
          FEDERAL COURT SITTING IN THE CITY AND COUNTY OF DENVER, STATE OF
          COLORADO, UNITED STATES OF AMERICA, AND YOU EXPRESSLY WAIVE ANY
          OBJECTION THAT YOU MAY HAVE NOW OR HEREAFTER TO THE LAYING OF THE
          VENUE OR TO THE JURISDICTION OF ANY SUCH PROCEEDING. YOU AGREE THAT
          ANY CLAIM OR CAUSE OF ACTION ARISING OUT OF OR RELATED TO YOUR USE OF
          THE SITE, SERVICES AND/OR CONTENT MUST BE FILED WITHIN ONE (1) YEAR
          AFTER SUCH CLAIM OR CAUSE OF ACTION AROSE.
        </p>

        <h2>16. No Waiver; Severability</h2>
        <p>
          Our failure to exercise or delay in exercising any right, power, or
          privilege under this Agreement shall not operate as a waiver; nor
          shall any single or partial exercise of any right, power, or privilege
          preclude any other or further exercise thereof.
        </p>

        <p>
          If any provision or term of this Agreement shall be determined to be
          invalid or unenforceable under any rule, law, or regulation or any
          governmental agency, local, state, or federal, such provision will be
          changed and interpreted to accomplish the objectives of the term or
          provision to the greatest extent possible under any applicable law and
          the validity or enforceability of any other provision of this
          Agreement shall not be affected.
        </p>
        {mode !== "app" && (
          <div
            className="flex flex-row justify-center items-center my-4 cursor-pointer"
            onClick={() => router.back()}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <p className="ml-2">Go Back</p>
          </div>
        )}
      </section>
    </>
  );
};
