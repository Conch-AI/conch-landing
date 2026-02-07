// // import { makePostRequest } from "../../../../../helpers/requests";

// import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
// import toast from "react-hot-toast";

// interface NewsletterFormProps {
//   closeFn?: () => void;
// }

// const NewsletterForm = ({ closeFn: _closeFn }: NewsletterFormProps) => {
//   const {
//     register,
//     handleSubmit,
//   } = useForm();

//   const addToMailingList: SubmitHandler<FieldValues> = () => {
//     toast.loading("Sign up for our newsletter!");
//     // makePostRequest(`${API_BASE_URL}/newsletter/add`, { email })
//     //   .then((res) => {
//     //     toast.remove();
//     //     toast.success(res?.data?.message || "Added to Mailing List!");
//     //     reset();
//     //     if (closeFn) {
//     //       closeFn();
//     //     }
//     //   })
//     //   .catch((err) => {
//     //     toast.remove();
//     //     toast.error(err?.data?.message || "Error subscribing to newsletter!");
//     //   });
//   };
//   return (
//     <form
//       onSubmit={handleSubmit(addToMailingList)}
//       className="mx-auto max-w-md w-full flex flex-col sm:flex-row gap-2 sm:gap-3"
//     >
//       <input
//         type="email"
//         required={true}
//         className="flex-1 h-10 sm:h-11 w-full rounded-lg border border-gray-200 px-3 sm:px-4 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] focus-visible:outline-none transition-colors placeholder:text-gray-400"
//         placeholder="Enter your email"
//         id="email"
//         {...register("email")}
//       />
//       <button
//         type="submit"
//         className="h-10 sm:h-11 px-6 sm:px-8 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#5558e3] transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
//       >
//         Subscribe
//       </button>
//     </form>
//   );
// };

// export default NewsletterForm;
