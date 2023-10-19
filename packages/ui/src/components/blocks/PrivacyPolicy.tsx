import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useRouter } from "next/router";

export const PrivacyPolicy = () => {
  const router = useRouter();
  const { mode } = router.query;
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <section className="max-w-screen-lg bg-white rounded-xl p-4 sm:p-8 mx-4 sm:mx-auto m-4 sm:m-8">
        {mode !== "app" && (
          <div
            className="flex flex-row justify-center items-center my-4 cursor-pointer"
            onClick={() => router.back()}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <p className="ml-2">Go Back</p>
          </div>
        )}
        <h1>Privacy Policy</h1>
        <h2>Introduction</h2>
        <p>
          MoVET, Inc. ( &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
          operates the website located at{" "}
          <a href="https://movetcare.com" target="_blank" rel="noreferrer">
            movetcare.com
          </a>{" "}
          and other related websites and mobile applications with links to this
          Privacy Policy (collectively, the &quot;Site&quot;). Through the Site,
          we operate an online service enabling users (&quot;User&quot;) to
          receive health services from various pet care providers (the
          &quot;Services&quot;). We developed this privacy policy (&quot;Privacy
          Policy&quot;) to explain how we collect, use, and disclose information
          from and/or about you when you use the Site or the Services.
        </p>
        <p>
          THE SITE WILL BE COLLECTING AND TRANSMITTING YOUR PERSONAL INFORMATION
          AS WELL AS MEDICAL AND HEALTH-RELATED INFORMATION ABOUT YOUR PET. BY
          USING THE SITE, YOU AGREE THAT WE CAN COLLECT AND USE YOUR PERSONAL,
          YOUR PET INFORMATION AND OTHER INFORMATION AS DESCRIBED IN THIS
          PRIVACY POLICY. IF YOU DO NOT AGREE, PLEASE DO NOT USE THE SITE.
        </p>
        <p>
          By agreeing to the Terms you are accepting and consenting to the
          practices described in this policy.
        </p>
        <p>
          For the purpose of the Data Protection Act 1998 (the &quot;Act&quot;),
          the data controller is MoVET, Inc. of Denver, CO (the
          &quot;Company&quot;).
        </p>
        <h2>IMPORTANT DEFINITIONS</h2>
        <p>
          When we use the term &quot;Personal Information&quot; in this Privacy
          Policy, we mean information about you that is personally identifiable
          to you, such as your contact information (e.g., name, address, email
          address, location or telephone number), your pet details and medical
          information (&quot;Pet Health Information&quot;), and any other
          non-public information that is associated with such information
          (collectively, &quot;Personal Information&quot;). When we use the term
          &quot;De-Identified Information&quot;, we mean information that is
          neither used nor intended to be used to personally identify an
          individual. Lastly, when we use the term &quot;Cookies&quot;, we mean
          the small pieces of information that a Site sends to your browser
          while you are viewing a website.
        </p>
        <h2>Children Under Age 18</h2>
        <p>
          We do not knowingly allow individuals under the age 18 to create
          Accounts that allow access to our Site.
        </p>
        <h2>Collection of Personal Information</h2>
        <p>We collect or maintain personal information that may include:</p>
        <ul>
          <li>
            Your name, age, email address, username, password, location,
            telephone number and other registration information
          </li>
          <li>
            Pet details that you provide, including name, species, breed, age,
            weight
          </li>
          <li>
            Pet Health Information that you provide us, which may include
            information or records relating to your pet medical or health
            history, health status and other health related information
          </li>
          <li>
            Health information about your pet prepared by the pet care
            provider(s) who provide the Services through the Site such as
            medical records, treatment and examination notes, and other health
            related information
          </li>
          <li>
            Billing information that you provide us, such as credit card
            information
          </li>
          <li>
            Information about the computer or mobile device you are using, such
            as what Internet browser you use, the kind of computer or mobile
            device you use, and other information about how you use the Site
          </li>
          <li>
            Details of your existing vet of record, and any information
            pertaining to the recovery of the pet(s) medical records
          </li>
          <li>Other information you input into the Site or related services</li>
        </ul>
        <h2>Usage of Personal Health Data</h2>
        <p>
          We may use your Personal and your Pet Health Information for the
          following purposes (subject to applicable legal restrictions):
        </p>
        <ul>
          <li>To provide you with the Services</li>
          <li>
            To improve the quality of healthcare through the performance of
            quality reviews and similar activities
          </li>
          <li>
            To create De-identified Information such as aggregate statistics
            relating to the use of the Service
          </li>
          <li>To notify you when Site updates are available,</li>
          <li>To market and promote the Site and the Services to you</li>
          <li>
            To fulfill any other purpose for which you provide us Personal
            Information
          </li>
          <li>For any other purpose for which you give us authorization</li>
        </ul>
        <h2>Security and Storage of Your Information</h2>
        <p>
          MoVET, Inc. cares about the security of your information and employs
          physical, administrative, and technological safeguards designed to
          help protect against unauthorized access to Personal Information, such
          as encryption. We do not store your personal health data on your
          computer or mobile device. However, no security system is impenetrable
          and we cannot guarantee the security of our systems 100%. In the event
          that any information under our control is compromised as a result of a
          breach of security, we will take reasonable steps to investigate the
          situation and where appropriate, notify those individuals whose
          information may have been compromised and take other steps, in
          accordance with any applicable laws and regulations. As a result,
          while we try to protect your Personal Information, we cannot ensure or
          guarantee the security of any information you transmit to us, and you
          do so at your own risk.
        </p>
        <p>
          Your information collected through the Site may be stored and
          processed in the United States or any other country in which MoVET,
          Inc. or its subsidiaries, affiliates or service providers maintain
          facilities. If you are located in the European Union or other regions
          with laws governing data collection and use that may differ from U.S.
          law, please note that we may transfer information, including personal
          information, to a country and jurisdiction that does not have the same
          data protection laws as your jurisdiction, and you consent to the
          transfer of information to the U.S. or any other country in which
          Company or its parent, subsidiaries, affiliates or service providers
          maintain facilities and the use and disclosure of information about
          you as described in this Privacy Policy.
        </p>
        <p>
          Where you have chosen a password that enables you to access certain
          parts of our App, you are responsible for keeping this password
          confidential. We ask you not to share the password with anyone.
        </p>
        <h2>Storage of Personal Data</h2>
        <p>
          We encrypt data transmitted to and from the Website and App. Once we
          have received your information, we will use strict procedures and
          security features to try to prevent unauthorized access. By submitting
          your personal data, you agree to this transfer, storing or processing.
          We do not store any credit or debit card information. You further
          agree that we will not be responsible for any failures of the third
          party to adequately protect your Payment and other information in such
          third party&apos;s possession. You agree that your provision of your
          Payment Information and other information to such third party is
          subject to the conditions of the third party payment service
          provider&apos;s terms of service and by providing your Payment Method
          and related information you agree to such third party&apos;s terms and
          conditions of service. Payments are processed via a third party
          payment provider that is fully compliant with Level 1 Payment Card
          Industry (PCI) data security standards. Any payment transactions are
          encrypted using SSL technology.The current third party payment
          processor is Stripe, and their current terms and conditions of service
          and privacy policy are available at{" "}
          <a
            href="https://stripe.com/us/privacy"
            target="_blank"
            rel="noreferrer"
          >
            https://stripe.com/us/privacy
          </a>
          . You acknowledge that we may change the third party payment service
          and move your information to other service providers that encrypt your
          information using industry standard security technology. We will take
          all steps reasonably necessary to ensure that your data is treated
          securely and in accordance with this privacy policy. Other data may be
          processed or stored via destinations outside the United States.
        </p>
        <h2>Disclosure of Personal Information</h2>
        <p>
          We may also disclose Personal Information that we collect or you
          provide (subject to applicable legal restrictions):
        </p>
        <ul>
          <li>To our subsidiaries and affiliates.</li>
          <li>
            To contractors, service providers and other third parties we use to
            support our business and who are bound by contractual obligations to
            keep personal information confidential and use it only for the
            purposes for which we disclose it to them.
          </li>
          <li>
            As required by law, which can include providing information as
            required by a court order.
          </li>
          <li>
            When we believe in good faith that disclosure is necessary to
            protect your safety or the safety of others, to protect our rights,
            to investigate fraud, or to respond to a government request.
          </li>
          <li>
            To a buyer or other successor in the event of a merger, divestiture,
            restructuring, reorganization, dissolution or other sale or transfer
            of some or all of MoVET, Inc.&apos;s assets, whether as a going
            concern or as part of bankruptcy, liquidation or similar proceeding,
            in which Personal Information maintained by the Site is among the
            assets transferred.
          </li>
          <li>
            We may also share information with others in an aggregated and
            anonymous form that does not reasonably identify you directly as an
            individual.
          </li>
          <li>
            For any other purpose disclosed by us when you provide the
            information.
          </li>
        </ul>
        <h2>Information We Collect Via Technology</h2>
        <p>
          We, and our third party partners, automatically collect certain types
          of usage information when you visit our Services, read our emails, or
          otherwise engage with us. We typically collect this information
          through a variety of tracking technologies, including cookies, Flash
          objects, web beacons, file information and similar technology
          (collectively, &quot;tracking technologies&quot;). For example, we
          collect information about your device and its software, such as your
          IP address, browser type, Internet service provider, platform type,
          device type, operating system, date and time stamp, a unique ID that
          allows us to uniquely identify your browser, mobile device or your
          account, and other such information. We also collect information about
          the way you use our Service, for example, the site from which you came
          and the site to which you are going when you leave our website, the
          pages you visit, the links you click, how frequently you access the
          Service, whether you open emails or click the links contained in
          emails, whether you access the Service from multiple devices, and
          other actions you take on the Service. When you access our Service
          from a mobile device, we may collect unique identification numbers
          associated with your device or our mobile application (including, for
          example, a UDID, Unique ID for Advertisers (&quot;IDFA&quot;), Google
          AdID, or Windows Advertising ID), mobile carrier, device type, model
          and manufacturer, mobile device operating system brand and model,
          phone number, and depending on your mobile device settings, your
          geographical location data, including GPS coordinates (e.g., latitude
          and/or longitude) or similar information regarding the location of
          your mobile device, or we may be able to approximate a device&apos;s
          location by analyzing other information, like an IP address. As you
          use the Site or the Service, certain information may be passively
          collected by Cookies, navigational data like Uniform Resource Locators
          (URLs) and third party tracking services, including:
        </p>
        <ul>
          <li>
            Site Activity Information. We may keep track of some of the actions
            you take on the Site, such as the content of searches you perform on
            the Site.
          </li>
          <li>
            Access Device and Browser Information. When you access the Site from
            a computer or other device, we may collect anonymous information
            from that device, such as your Internet protocol address, browser
            type, connection speed and access times (collectively,
            &quot;Anonymous Information&quot;). We may also work with third
            party partners to employ technologies, including the application of
            statistical modeling tools, which attempt to recognize you across
            multiple devices.
          </li>
          <li>
            Cookies. We may use both session Cookies (which expire once you
            close your web browser) and persistent Cookies to make the Site and
            Service easier to use, to make our advertising better, and to
            protect both you and MoVET, Inc. You can instruct your browser, by
            changing its options, to stop accepting Cookies or to prompt you
            before accepting a Cookie from the websites you visit. If you do not
            accept Cookies, however, you will not be able to stay logged in to
            the Site. Although we do our best to honor the privacy preferences
            of our users, we are unable to respond to &quot;Do Not Track&quot;
            signals set by your browser at this time. If you would prefer not to
            accept cookies, most browsers will allow you to: (i) change your
            browser settings to notify you when you receive a cookie, which lets
            you choose whether or not to accept it; (ii) disable existing
            cookies; or (iii) set your browser to automatically reject cookies.
            Please note that doing so may negatively impact your experience
            using the Service, as some features and services on our Service may
            not work properly. Depending on your mobile device and operating
            system, you may not be able to delete or block all cookies. You may
            also set your e-mail options to prevent the automatic downloading of
            images that may contain technologies that would allow us to know
            whether you have accessed our e-mail and performed certain functions
            with it. [Deleting cookies does not delete Local Storage Objects
            (LSOs) such as Flash objects and HTML 5. If you choose to delete
            Flash objects from our sites, then you may not be able to access and
            use all or part of the sites or benefit from the information and
            services offered.]
          </li>
          <li>
            Real-Time Location. Certain features of the Site use GPS technology
            to collect real-time information about the location of your device
            so that the Site can connect you to a health care provider who is
            licensed or authorized to provide services in the state where you
            are located.
          </li>
          <li>
            Mobile Services. We may also collect non-personal information from
            your mobile device or computer. This information is generally used
            to help us deliver the most relevant information to you. Examples of
            information that may be collected and used include how you use the
            application(s) and information about the type of device or computer
            you use. In addition, in the event our application(s) crashes on
            your mobile device we will receive information about your mobile
            device model software version and device carrier, which allows us to
            identify and fix bugs and otherwise improve the performance of our
            application(s).
          </li>
          <li>
            Google Analytics. We may collect analytics data, or use third-party
            analytics tools, to help us measure traffic and usage trends for the
            Service and to understand more about the demographics of our users.
            We use Google Analytics to help analyze how users use the Site.
            Google Analytics uses Cookies to collect information such as how
            often users visit the Site, what pages they visit, and what other
            sites they used prior to coming to the Site. We use the information
            we get from Google Analytics only to improve our Site and Services.
            Google Analytics collects only the IP address assigned to you on the
            date you visit the Site, rather than your name or other personally
            identifying information. Although Google Analytics plants a
            persistent Cookie on your web browser to identify you as a unique
            user the next time you visit the Site, the Cookie cannot be used by
            anyone but Google. Google&apos;s ability to use and share
            information collected by Google Analytics about your visits to the
            Site is restricted by the Google Analytics Terms of Use and the
            Google Privacy Policy.
          </li>
        </ul>
        <p>
          We use or may use the data collected through tracking technologies to:
          (a) remember information so that you will not have to re-enter it
          during your visit or the next time you visit the site; (b) provide
          custom, personalized content and information, including targeted
          content and advertising; (c) identify you across multiple devices; (d)
          provide and monitor the effectiveness of our Service; (e) monitor
          aggregate metrics such as total number of visitors, traffic, usage,
          and demographic patterns on our website; (f) diagnose or fix
          technology problems; and (g) otherwise to plan for and enhance our
          service.
        </p>
        <h2>De-Identified Information</h2>
        <p>
          We may use De-Identified Information created by us without
          restriction.
        </p>
        <h2>Data Collected Through the Use of Service</h2>
        <p>
          After you set up your account, we collect information about how you
          use the Service and about your actions on the Service, including your
          scheduling, work schedule, your availability, your messages to others
          on the Service and comments you make on the Service forums or blog
          posts.
        </p>
        <h2>Information We Receive from Social Networking Sites</h2>
        <p>
          When you interact with our site through various social media, such as
          when you login through Facebook or Google, or share content on
          Facebook, Instagram, or other sites, we may receive information from
          the social network including your profile information, profile
          picture, gender, user name, user ID associated with your social media
          account, age range, language, country, friends list, and any other
          information you permit the social network to share with third parties.
          The data we receive is dependent upon your privacy settings with the
          social network, and we will not post information about you on third
          party social media sites without your consent. You should always
          review, and if necessary, adjust your privacy settings on third-party
          websites and services before linking or connecting them to our website
          or Service.
        </p>
        <h2>Calendar Information</h2>
        <p>
          With your permission, we may integrate our Service with your calendar
          system (such as Google Calendar, Outlook, etc.) in order to provide
          updates of your schedule on the Service to your calendar, and to
          integrate your calendar entries with your MoVET, Inc. schedule.
        </p>
        <h2>Information You Share with Third Parties</h2>
        <p>
          This Privacy Policy applies only to information we collect through the
          Site and in email, text and other electronic communications set
          through or in connection with the Site. This policy DOES NOT apply to
          information collected by any third party. When you click on links on
          the Site you may leave our site. We are not responsible for the
          privacy practices of other sites, and we encourage you to read their
          privacy statements.
        </p>
        <h2>Modification of Information</h2>
        <p>
          Users will be able to update some of their information through the
          Site. Requests to modify any information may also be submitted
          directly to info@movetcare.com.
        </p>
        <h2>Communications</h2>
        <p>
          From time to time, the Service will send communications about news and
          updates, advice and analytics relating to your use of the Service. The
          Service also facilitates communication between users by email, text
          message and in-app notifications. Users can adjust communications
          preferences through Settings.
        </p>
        <ul>
          <li>
            When the Service invites a user to register with the Service, we
            will send that user a message using the contact information
            provided.
          </li>
          <li>
            If you want to invite your friends, contacts or employees to try out
            the Service, we will send the contact an email, which may include
            your name and photo to let them know that you are the person
            extending the invitation. After sending these invitations, we may
            also send reminder emails to your invitees on your behalf. We will
            store these contacts for ease of connecting with them on the Service
            at a later time. We may also provide you the option to send
            invitations via SMS text message. You may not use the Service to
            send text messages unless you have the consent from the recipient to
            receive text message communications.
          </li>
        </ul>
        <h2>Marketing Communications</h2>
        <p>
          From time to time, we may send promotional messages. If you do not
          wish to receive promotional emails, you can change your email
          preferences and click the &quot;unsubscribe&quot; button on
          promotional email communications. Note that you are not permitted to
          unsubscribe or opt-out of non-promotional messages regarding your
          account, such as account verification, change or updates to features
          of the Service, or technical and security notices.
        </p>
        <h2>Third Party Tracking and Online Advertising</h2>
        <p>
          We may share, or we may permit third party online advertising
          networks, social media companies and other third party services, to
          collect, information about your use of our website, and from our
          emails/communications, over time so that they may play or display ads
          that may be relevant to your interests on our Service as well as on
          other websites or apps, or on other devices you may use. Typically,
          though not always, the information we share is provided through
          cookies or similar tracking technologies, which recognize the device
          you are using and collect information, including hashed data, click
          stream information, browser type, time and date you visited the site,
          and other information. This information is used to display targeted
          ads on or through our Service or on other websites or apps, including
          on Facebook. We or the online advertising networks use this
          information to make the advertisements you see online more relevant to
          your interests. As noted above, depending on your browser or mobile
          device, you may be able set your browser to delete or notify you of
          cookies and other tracking technology by actively managing the
          settings on your browser or mobile device. You may also be able to
          limit interest-based advertising through the settings on your mobile
          device by selecting &quot;limit ad tracking&quot; (iOS) or
          &quot;opt-out of interest based ads&quot; (Android). To learn more
          about interest-based advertising and how you may be able to opt-out of
          some of this advertising, you may wish to visit the Network
          Advertising Initiative&apos;s online resources, at{" "}
          <a
            href="https://networkadvertising.org/choices"
            target="_blank"
            rel="noreferrer"
          >
            networkadvertising.org/choices
          </a>
          , and/or the DAA&apos;s resources at{" "}
          <a
            href="https://aboutads.info/choices"
            target="_blank"
            rel="noreferrer"
          >
            aboutads.info/choices
          </a>
          , and you may also adjust your ad preferences through your Facebook
          settings. Some of these opt-outs may not be effective unless your
          browser is set to accept cookies. Furthermore, if you use a different
          device, change browsers or delete the opt-out cookie, you may need to
          perform the opt-out task again. You may also be able to opt-out of
          some - but not all - interest-based ads served by mobile ad networks
          by visiting{" "}
          <a
            href="https://youradchoices.com/appchoices"
            target="_blank"
            rel="noreferrer"
          >
            youradchoices.com/appchoices
          </a>{" "}
          and downloading the mobile AppChoices app.
        </p>
        <h2>Data Retention</h2>
        <p>
          We will retain your information for as long as your account is active
          or as needed to for our internal purposes. When you deactivate your
          account, we will remove your information from view by others on the
          Service but we may retain your account information internally so that
          you can access your account history through an individual account and
          re-register an account more quickly in the future. You may request to
          delete your account information by contacting us at
          info@movetcare.com. However, please be aware that we will not be able
          to delete any content you have shared with others on the Service.
        </p>
        <h2>Limitations on Deletion of Information</h2>
        <p>
          You may request deletion of your Personal Information by us, but
          please note that we may be required (by law or otherwise) to keep this
          information and not delete it (or to keep this information for a
          certain time, in which case we will comply with your deletion request
          only after we have fulfilled such requirements). When we delete
          Personal Information, it will be deleted from the active database, but
          may remain in our archives and we may also retain Anonymous
          Information about your use of our Service. Once we disclose some of
          your Personal Information to third parties, we may not be able to
          access that Personal Information any longer and cannot force the
          deletion or modification of any such information by the parties to
          whom we have made those disclosures. After we delete Personal
          Information, we will retain De-Identified Data and will continue to
          use De-Identified Data as permitted under this Privacy Policy.
        </p>
        <h2>Report Violations</h2>
        <p>
          You should report any security violations to us by sending an email to
          info@movetcare.com.
        </p>
        <h2>Updates to this Privacy Policy</h2>
        <p>
          We reserve the right to modify this Policy from time to time. If we
          make any changes to this Policy, we will change the &quot;Last
          Revision&quot; date below and will post the updated Policy on this
          page. If you object to any changes, you may close your account.
          Continuing to use our Services after we publish changes to this
          Privacy Policy means that you are consenting to the changes.
        </p>
        <h2>Contacting Us</h2>
        If you have questions about this Policy, please contact us at
        info@movetcare.com.
        <h2>Last Revision Date</h2>
        <p>
          This Policy was posted on April 1st 2022, and last revised on, and
          effective as of, April 1st 2022.
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
