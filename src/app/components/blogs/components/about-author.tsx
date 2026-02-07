import Image from "next/image";

const AboutAuthor = ({
  image,
  description,
}: {
  image: string;
  description: string;
}) => {
  return (
    <div
      id="about-author"
      className="mx-[1.5rem] flex flex-col justify-start gap-[2.33rem] bg-[#F6F5FD] px-[2rem] pb-[2.5rem] md:mx-[3.85rem] md:h-[16.18945rem] md:flex-row md:items-center md:px-[0rem] md:pb-[0rem]"
    >
      <Image
        className="ml-[3rem] h-[12.10938rem] w-[9.6875rem] overflow-hidden"
        style={{ objectFit: "cover" }}
        src={image}
        alt="author-profile-image"
        width={150}
        height={150}
      />
      <div className="my-8 flex flex-col gap-3 self-stretch md:w-[60%]">
        <p className="my-0 py-0 text-[1.25rem] font-[500] leading-normal">
          ABOUT THE AUTHOR
        </p>
        <p className="my-0 py-0 text-[1rem] font-[400] leading-[1.6425rem]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AboutAuthor;
