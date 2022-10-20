import { faAppStore, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "./Button";

export const ClientReviews = ({
  mode = "link",
}: {
  mode?: "full" | "compact" | "link";
}) => {
  const router = useRouter();
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false);
  return (
    <div className="sm:grid sm:grid-cols-2 sm:gap-8">
      <div
        className="group bg-white p-8 rounded-xl my-8 sm:my-4 cursor-pointer"
        onClick={() =>
          window.open(
            "https://apps.apple.com/us/app/movet-on-demand-vet-services/id1478031556",
            "_blank"
          )
        }
      >
        <div className="flex flex-row justify-center items-center text-movet-yellow text-3xl my-8 group-hover:opacity-75 group-hover:opacity-75">
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
        </div>
        <p className="text-xl text-center mb-4 group-hover:opacity-75">
          A must have support service for any dog owner
        </p>
        <i className="group-hover:opacity-75">
          &quot;WOW. Doctor Abramson is a GODSEND. I don&apos;t know how people
          navigate the veterinary healthcare system without a service like
          MoVET. I was never one to care much about my vet choice beyond price.
          My experience with MoVET completely changed my outlook on what
          excellence in vet service could look like. [...] Thank you MoVET for
          saving Bowie and providing me with so much care and support along the
          way.&quot;
        </i>
        <p className="text-center mt-4 group-hover:opacity-75">
          <a
            href="https://apps.apple.com/us/app/movet-on-demand-vet-services/id1478031556"
            target="_blank"
            rel="noreferrer"
            className="flex flex-row justify-center items-center italic text-center text-movet-black"
          >
            <FontAwesomeIcon
              icon={faAppStore}
              className="mr-2 text-movet-blue"
            />{" "}
            App Store Review
          </a>
        </p>
      </div>
      <div
        className="group bg-white p-8 rounded-xl my-8 sm:my-4 cursor-pointer"
        onClick={() =>
          window.open("https://goo.gl/maps/ueNYMwizKqQHqSJd8", "_blank")
        }
      >
        <div className="flex flex-row justify-center items-center text-movet-yellow text-3xl my-8 group-hover:opacity-75">
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
        </div>
        <p className="text-xl text-center mb-4 group-hover:opacity-75">
          They always go the extra mile
        </p>
        <i className="group-hover:opacity-75">
          &quot;Dr. Abramson and Dr. Caldwell are fantastic vets - kind,
          knowledgeable, and extremely helpful. They always go the extra mile to
          ensure that my dog is well cared for, dropping off medication when I
          couldn&apos;t come into the clinic, providing advice for me to follow
          at home, and following up to ensure that my dog was responding well to
          treatment. I could not ask for a better vet or service! And their
          clinic space is gorgeous - a warm and inviting environment. I feel so
          lucky to have them nearby! &quot;
        </i>
        <p className="text-center mt-4 group-hover:opacity-75">
          <a
            href="https://goo.gl/maps/ueNYMwizKqQHqSJd8"
            target="_blank"
            rel="noreferrer"
            className="flex flex-row justify-center items-center italic text-center text-movet-black"
          >
            <FontAwesomeIcon icon={faGoogle} className="mr-2 text-movet-blue" />{" "}
            Google Review
          </a>
        </p>
      </div>
      <div
        className="group bg-white p-8 rounded-xl my-8 sm:mb-4 sm:-mt-4 cursor-pointer"
        onClick={() =>
          window.open(
            "https://apps.apple.com/us/app/movet-on-demand-vet-services/id1478031556",
            "_blank"
          )
        }
      >
        <div className="flex flex-row justify-center items-center text-movet-yellow text-3xl my-8 group-hover:opacity-75">
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
        </div>
        <p className="text-xl text-center mb-4 group-hover:opacity-75">Best veterinarian</p>
        <i className="group-hover:opacity-75">
          &quot;This app give you access to the best vet hands down!!! Easy to
          use and easy to set up appointments!&quot;
        </i>
        <p className="text-center mt-4 group-hover:opacity-75">
          <a
            href="https://apps.apple.com/us/app/movet-on-demand-vet-services/id1478031556"
            target="_blank"
            rel="noreferrer"
            className="flex flex-row justify-center items-center italic text-center text-movet-black"
          >
            <FontAwesomeIcon
              icon={faAppStore}
              className="mr-2 text-movet-blue"
            />{" "}
            App Store Review
          </a>
        </p>
      </div>
      <div
        className="group bg-white p-8 rounded-xl my-8 sm:mb-4 sm:-mt-4 cursor-pointer"
        onClick={() =>
          window.open("https://goo.gl/maps/aUEkuAb48XmfyF2a8", "_blank")
        }
      >
        <div className="flex flex-row justify-center items-center text-movet-yellow text-3xl my-8 group-hover:opacity-75">
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
        </div>
        <p className="text-xl text-center mb-4 group-hover:opacity-75">Highly recommend!</p>
        <i className="group-hover:opacity-75">
          &quot;Wonderfully positive experience for our family and our pet.
          Staff is smart, kind, clear, empathetic and patient. Highly
          recommend!!!&quot;
        </i>
        <p className="text-center mt-4 group-hover:opacity-75">
          <a
            href="https://goo.gl/maps/aUEkuAb48XmfyF2a8"
            target="_blank"
            rel="noreferrer"
            className="flex flex-row justify-center items-center italic text-center text-movet-black"
          >
            <FontAwesomeIcon icon={faGoogle} className="mr-2 text-movet-blue" />{" "}
            Google Review
          </a>
        </p>
      </div>
      {mode === "link" && (
        <div className="col-span-2 flex justify-center mx-auto">
          <Button
            text={"See All Reviews"}
            color="red"
            onClick={() => router.push("/reviews")}
            className={showAllReviews ? "mb-8" : ""}
          />
        </div>
      )}
      {mode === "compact" && (
        <div className="col-span-2 flex justify-center mx-auto">
          <Button
            text={showAllReviews ? "Hide Reviews" : "Show More Reviews"}
            color="red"
            onClick={() => setShowAllReviews(!showAllReviews)}
            className={showAllReviews ? "mb-8" : ""}
          />
        </div>
      )}
      {(showAllReviews || mode === "full") && (
        <>
          <div
            className="group bg-white p-8 rounded-xl my-8 sm:mb-4 sm:-mt-4 cursor-pointer"
            onClick={() =>
              window.open("https://goo.gl/maps/2ce5B2QsrG4ohspc6", "_blank")
            }
          >
            <div className="flex flex-row justify-center items-center text-movet-yellow text-3xl my-8 group-hover:opacity-75">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </div>
            <p className="text-xl text-center mb-4 group-hover:opacity-75">
              They were with me every step of the way and took excellent care of
              my baby
            </p>
            <i className="group-hover:opacity-75">
              &quot;I am more than pleased with this practice. I am a travel
              healthcare worker from South Carolina. My dog, Zoe, was in kidney
              failure when we arrived in Denver. Dr. Caldwell met with us and
              was so compassionate and caring towards my Zoe. We made a plan for
              care. However, my baby girl rapidly declined. Dr. Caldwell was
              honest in her assessment and let me make the decision as to when
              to let my girl go. It was the hardest thing I have ever had to do
              but they were with me every step of the way and took excellent
              care of my baby. If my baby girl was still with me this would be
              the practice we would go to.&quot;
            </i>
            <p className="text-center mt-4 group-hover:opacity-75">
              <a
                href="https://goo.gl/maps/2ce5B2QsrG4ohspc6"
                target="_blank"
                rel="noreferrer"
                className="flex flex-row justify-center items-center italic text-center text-movet-black"
              >
                <FontAwesomeIcon
                  icon={faGoogle}
                  className="mr-2 text-movet-blue"
                />{" "}
                Google Review
              </a>
            </p>
          </div>
          <div
            className="group bg-white p-8 rounded-xl my-8 sm:mb-4 sm:-mt-4 cursor-pointer"
            onClick={() =>
              window.open("https://goo.gl/maps/6zSsAiEfmDoGSG226", "_blank")
            }
          >
            <div className="flex flex-row justify-center items-center text-movet-yellow text-3xl my-8 group-hover:opacity-75">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </div>
            <p className="text-xl text-center mb-4 group-hover:opacity-75">
              No more trying to drag cats and wild dogs into the clinic
            </p>
            <i className="group-hover:opacity-75">
              &quot;MoVET has been great! I can get all of my Veterinary stuff
              take care of at home! No more trying to drag cats and wild dogs
              into the clinic. Dr A is very personable and very knowledgeable.
              You can do as much or as little as you want with NO pressure. I
              also love the app, super easy. Specially during COVID I am at my
              house with my animals and I don’t have to be separated. The cats
              are less stressed and the dogs get all the pets. Everyone loves
              it&quot;
            </i>
            <p className="text-center mt-4 group-hover:opacity-75">
              <a
                href="https://goo.gl/maps/6zSsAiEfmDoGSG226"
                target="_blank"
                rel="noreferrer"
                className="flex flex-row justify-center items-center italic text-center text-movet-black"
              >
                <FontAwesomeIcon
                  icon={faGoogle}
                  className="mr-2 text-movet-blue"
                />{" "}
                Google Review
              </a>
            </p>
          </div>
          <div
            className="group bg-white p-8 rounded-xl my-8 sm:mb-4 sm:-mt-4 cursor-pointer"
            onClick={() =>
              window.open("https://goo.gl/maps/9qNi9kyyYzz2MxSV7", "_blank")
            }
          >
            <div className="flex flex-row justify-center items-center text-movet-yellow text-3xl my-8 group-hover:opacity-75">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </div>
            <p className="text-xl text-center mb-4 group-hover:opacity-75">WOW</p>
            <i className="group-hover:opacity-75">
              &quot;WOW. Doctor A is a GODSEND. I don&apos;t know how people
              navigate the veterinary healthcare system without a service like
              MoVET. I was never one to care much about my vet choice beyond
              price. My experience with MOVET completely changed my outlook on
              what excellence in vet service could look like. [...]&quot;
            </i>
            <p className="text-center mt-4 group-hover:opacity-75">
              <a
                href="https://goo.gl/maps/9qNi9kyyYzz2MxSV7"
                target="_blank"
                rel="noreferrer"
                className="flex flex-row justify-center items-center italic text-center text-movet-black"
              >
                <FontAwesomeIcon
                  icon={faGoogle}
                  className="mr-2 text-movet-blue"
                />{" "}
                Google Review
              </a>
            </p>
          </div>
          <div
            className="group bg-white p-8 rounded-xl my-8 sm:mb-4 sm:-mt-4 cursor-pointer"
            onClick={() =>
              window.open("https://goo.gl/maps/ydT7218Ex2Yy3W2J8", "_blank")
            }
          >
            <div className="flex flex-row justify-center items-center text-movet-yellow text-3xl my-8 group-hover:opacity-75">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </div>
            <p className="text-xl text-center mb-4 group-hover:opacity-75">
              I can&apos;t recommend MoVET highly enough!
            </p>
            <i className="group-hover:opacity-75">
              &quot;Dr. A is THE BEST!!! She is the most caring and most
              knowledgeable vet I have ever worked with. She responded so
              quickly when I reached out and was there with me every step of the
              way when my dog Gus was having an emergency. She is so kind and so
              wonderful with humans and dogs alike! I can&apos;t recommend MoVET
              highly enough!&quot;
            </i>
            <p className="text-center mt-4 group-hover:opacity-75">
              <a
                href="https://goo.gl/maps/ydT7218Ex2Yy3W2J8"
                target="_blank"
                rel="noreferrer"
                className="flex flex-row justify-center items-center italic text-center text-movet-black"
              >
                <FontAwesomeIcon
                  icon={faGoogle}
                  className="mr-2 text-movet-blue"
                />{" "}
                Google Review
              </a>
            </p>
          </div>
          <div
            className="group bg-white p-8 rounded-xl my-8 sm:mb-4 sm:-mt-4 cursor-pointer"
            onClick={() =>
              window.open("https://goo.gl/maps/UbbFRExrmXQSZ8z27", "_blank")
            }
          >
            <div className="flex flex-row justify-center items-center text-movet-yellow text-3xl my-8 group-hover:opacity-75">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </div>
            <p className="text-xl text-center mb-4 group-hover:opacity-75">
              Download their app- it makes it so easy to schedule appointments
              and contact them!
            </p>
            <i className="group-hover:opacity-75">
              &quot;I can&apos;t say enough good things about Dr. A and her
              team. They are reasonably priced and she is the kindest most
              caring vet. I have an old cattle dog mix who does not travel well
              in his old age, the last time he was in a clinic setting he made
              himself sick he was so stressed. I&apos;m thrilled to find a
              reliable wonderful vet who will come to me and they even have
              telehealth visits available too! Download their app- it makes it
              so easy to schedule appointments and contact them!!!&quot;
            </i>
            <p className="text-center mt-4 group-hover:opacity-75">
              <a
                href="https://goo.gl/maps/UbbFRExrmXQSZ8z27"
                target="_blank"
                rel="noreferrer"
                className="flex flex-row justify-center items-center italic text-center text-movet-black"
              >
                <FontAwesomeIcon
                  icon={faGoogle}
                  className="mr-2 text-movet-blue"
                />{" "}
                Google Review
              </a>
            </p>
          </div>
          <div
            className="group bg-white p-8 rounded-xl my-8 sm:mb-4 sm:-mt-4 cursor-pointer"
            onClick={() =>
              window.open("https://goo.gl/maps/uAEGvxNiXuR3A7Be7", "_blank")
            }
          >
            <div className="flex flex-row justify-center items-center text-movet-yellow text-3xl my-8 group-hover:opacity-75">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </div>
            <p className="text-xl text-center mb-4 group-hover:opacity-75">
              Will definitely use them again
            </p>
            <i className="group-hover:opacity-75">
              &quot;MoVET was great. Super easy to schedule an appointment and
              they came to our house for the visit. They were caring and
              professional with my dog. Will definitely use them again.&quot;
            </i>
            <p className="text-center mt-4 group-hover:opacity-75">
              <a
                href="https://goo.gl/maps/uAEGvxNiXuR3A7Be7"
                target="_blank"
                rel="noreferrer"
                className="flex flex-row justify-center items-center italic text-center text-movet-black"
              >
                <FontAwesomeIcon
                  icon={faGoogle}
                  className="mr-2 text-movet-blue"
                />{" "}
                Google Review
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
};
