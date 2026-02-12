// import axios from "axios";
// import { getReqHeadersWithFirebaseAccessToken } from "lib/firebase/user";

// /**
//  * Function to get request headers
//  * @returns Promise with request headers object
//  */
// export const getRequestHeaders = async () => {
//   let reqHeaders = {};
//   try {
//     // get fresh access token and user id from Firebase
//     reqHeaders = (await getReqHeadersWithFirebaseAccessToken()).headers || {};
//   } catch (error) {
//     // if Firebase failed, use local storage request headers
//     reqHeaders = JSON.parse(localStorage.getItem("reqHeaders") ?? "{}");
//   }
//   return reqHeaders;
// };

// /**
//  * Wrapper around axios to make post requests
//  * @param url
//  * @param data
//  * @param useHeaders
//  * @returns
//  */
// export const makePostRequest = async (
//   url: string,
//   data: Record<string, any>,
//   useHeaders = true,
//   signal?: AbortSignal,
// ) => {
//   // If should use headers, get headers
//   let reqHeaders = {};

//   if (useHeaders) {
//     try {
//       // get fresh access token and user id from Firebase
//       reqHeaders = (await getReqHeadersWithFirebaseAccessToken()) || {};
//     } catch (error) {
//       // if Firebase, failed, use local storage request headers
//       try {
//         reqHeaders = JSON.parse(localStorage.getItem("reqHeaders") ?? "{}");
//       } catch (error) {
//         reqHeaders = {};
//       }
//     }
//   }

//   // Return axios with /login redirect on 401
//   return axios.post(url, data, {
//     ...reqHeaders,
//     ...(signal ? { signal } : {}),
//   });
// };

// export const makePutRequest = async (
//   url: string,
//   data: Record<string, any>,
//   useHeaders = true,
// ) => {
//   // If should use headers, get headers
//   let reqHeaders = {};

//   if (useHeaders) {
//     try {
//       // get fresh access token and user id from Firebase
//       reqHeaders = (await getReqHeadersWithFirebaseAccessToken()) || {};
//     } catch (error) {
//       // if Firebase, failed, use local storage request headers
//       reqHeaders = JSON.parse(localStorage.getItem("reqHeaders") ?? "{}");
//     }
//   }

//   // Return axios with /login redirect on 401
//   return axios.put(url, data, reqHeaders);
// };

// /**
//  * Wrapper around axios to make file upload requests
//  * @param url
//  * @param file
//  * @param link
//  * @param firebaseFile
//  * @param useHeaders
//  * @returns
//  */
// export const makeFileUploadRequest = async (
//   url: string,
//   file: File,
//   link: string,
//   firebaseFile: string,
//   useHeaders = true,
// ) => {
//   // If should use headers, get headers
//   let reqHeaders = {};
//   if (useHeaders) {
//     const headersObject = await getReqHeadersWithFirebaseAccessToken();
//     reqHeaders = headersObject ? headersObject.headers : {};
//   }

//   // Create a new FormData instance
//   const formData = new FormData();

//   // Append the file to the form data
//   formData.append("file", file);
//   formData.append("link", link);
//   formData.append("firebaseFile", firebaseFile);

//   // Return axios post request
//   return axios.post(url, formData, {
//     headers: {
//       ...reqHeaders,
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };

// export async function fetchAndStreamResponse(
//   url: string,
//   bodyParams: Record<string, any>,
//   onChunkReceived: (chunk: string) => void,
//   onEndStream: () => void,
// ) {
//   const reqHeaders = await getRequestHeaders();
//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...reqHeaders,
//     },
//     body: JSON.stringify(bodyParams),
//   });

//   if (!response.ok || !response.body) {
//     throw new Error(response.statusText || "Network response was not ok.");
//   }

//   const reader = response.body.getReader();
//   const decoder = new TextDecoder();

//   async function processStream() {
//     try {
//       let done = false;
//       while (!done) {
//         const { value, done: streamDone } = await reader.read();
//         done = streamDone;
//         if (!done) {
//           const chunk = decoder.decode(value, { stream: true });
//           onChunkReceived(chunk);
//         }
//       }
//       onEndStream();
//     } catch (error) {
//       throw error;
//     } finally {
//       reader.cancel(); // Ensure the reader is canceled to free up resources
//     }
//   }

//   await processStream();
// }

// export const extractErrorMessage = (err: any) => {
//   return (
//     err?.response?.data?.error || err?.response?.data?.message || err?.message
//   );
// };

// export const isPubliclyViewing = () => {
//   const pathname = window.location.pathname;
//   return pathname.includes("studysets") || pathname.includes("watch");
// };
