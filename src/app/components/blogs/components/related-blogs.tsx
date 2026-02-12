import moment from "moment";
import BlogCard from "./blog-card";
import { Post } from "types/Post";

const RelatedBlogs = ({ posts }: { posts: Post[] }) => {
  let renderedBlogs = 0;
  return (
    <div className="mx-[1.5rem] mt-[2rem] md:mx-[5.61rem] md:mt-[4.87rem]">
      <h1 className="mb-[1.61rem] text-[2.1875rem] font-[500]  leading-[2.64856rem] text-black">
        Related Posts
      </h1>

      <div className="my-0 flex flex-col items-start justify-start gap-[1.88rem] md:flex-row">
        {posts &&
          posts.map((item) => {
            if (!item?.featuredImage?.node?.sourceUrl || renderedBlogs === 3) {
              return;
            }
            renderedBlogs += 1;
            return (
              <BlogCard
                key={item.slug}
                slug={item.slug}
                title={item.title}
                image={item?.featuredImage?.node?.sourceUrl}
                date={moment(item.date).format("MMMM D, YYYY")}
              />
            );
          })}
      </div>
    </div>
  );
};

export default RelatedBlogs;
