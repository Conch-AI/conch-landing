// import NewsletterForm from "./newsletter-form";

const NewsletterSection = () => {
  return (
    <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 w-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#8b5cf6]/10 via-[#6366f1]/10 to-[#6366f1]/5 border border-[#6366f1]/20 pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-12 px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent mb-2 sm:mb-3">
        Stay Updated
      </h2>
      <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">
        Subscribe to our newsletter for the latest tips, tricks, and updates
      </p>
      {/* <NewsletterForm /> */}
    </div>
  );
};

export default NewsletterSection;
