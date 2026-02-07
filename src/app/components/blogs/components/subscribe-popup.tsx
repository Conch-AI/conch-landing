import Image from "next/image";
import SparklingStars from "../../../../public/icons/sparkling-stars.svg";
// import NewsletterForm from "./newsletter-form";

const SubscribePopup = ({ closeFn }: { closeFn: () => void }) => {
  return (
    <div className=" fixed top-0 left-0 flex h-screen  w-screen items-center justify-center bg-black/40 shadow-lg">
      <div className="relative z-[2] flex h-[22.6875rem] w-[19.25rem] items-center justify-center rounded-[1.25rem] border-[1px] border-[#DEDEDE]  bg-white  bg-white/75 backdrop-blur-[15.149999618530273px]">
        <Image
          src={SparklingStars}
          alt="stars"
          className="absolute right-[1.2rem] top-[-.8rem] h-[2.4375rem]  w-[2.4375rem]"
        />
        <div className="absolute top-0 left-0 z-[-1] flex h-full w-full items-center justify-center">
          <div className="h-[21.62894rem] w-[18.112rem] rounded-[1.125rem] bg-gradient-to-bl from-[#9B78E7] via-[#fff]  to-[#A757E4]/30 shadow-none" />
        </div>
        <div className="z-[20] h-[21.62894rem] w-[18.112rem] rounded-[1.125rem] p-0 text-center">
          <h1 className="my-0 mx-[2.4rem] mt-[2.54rem] h-[4.375rem] text-center text-[1.875rem]  font-[600] leading-tight">
            Stay up to date with AI news!
          </h1>
          <p className="my-0 mx-[1.8rem] mt-[.89rem] mb-[1.43rem] text-center  text-[1rem]  font-[400] leading-[1.39rem] text-[#767676]">
            Subscribe to our newsletter below for free goodies
          </p>
          {/* <NewsletterForm closeFn={closeFn} /> */}
          <p
            onClick={() => {
              closeFn();
            }}
            className="mt-[1rem] cursor-pointer text-center text-[.9375rem] font-[400] text-[#666] underline"
          >
            Close
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscribePopup;
