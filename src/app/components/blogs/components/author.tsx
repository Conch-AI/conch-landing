import Image from "next/image";

const Author = ({
  image,
  name,
  blogDate,
}: {
  image: string;
  blogDate: string;
  name: string;
}) => {
  return (
    <div className="my-0 flex h-[3.57rem] items-center justify-start">
      <Image
        className="h-[3.57rem] w-[3.57rem] overflow-hidden rounded-full"
        style={{ objectFit: "cover" }}
        src={image}
        alt="author-profile-image"
        width={150}
        height={150}
      />
      <div className="ml-[.88rem]">
        <p className="my-0 py-0 text-[1.125rem] leading-normal">{name}</p>
        <p className="my-0 py-0 text-[1rem] leading-normal text-[#878787]">
          {blogDate}
        </p>
      </div>
    </div>
  );
};

export default Author;
