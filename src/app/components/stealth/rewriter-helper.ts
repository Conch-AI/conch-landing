// import { makePostRequest } from "@/helpers/browser/requests";
// import {
//   RED_HIGHLIGHT,
//   RED_PERPLEXITY_MAX,
//   SECOND_BACKEND_URL,
// } from "@/helpers/shared/constants";
// import { getTextWordCount } from "@/helpers/shared/strings";
// import { divideTextInto75To100Words } from "@/helpers/stealth/general-utils";
// import { convertTextToHTML } from "@/helpers/write/editor-content";
// import useEnhanceSettings from "@/store/settings/useEnhanceSettings";
// import { getCurrentFirebaseUser } from "lib/firebase/user";
// import { toast } from "react-hot-toast";

// const MIN_WORDS_TO_REWRITE_PARAGRAPH = 10; // minimum words to rewrite a paragraph

// // promise to rewrite a sentence
// const createRewriteTextPromise = (
//   textToChange: String,
//   url: string,
// ): Promise<Record<string, any>> => {
//   const data = {
//     text: textToChange,
//   };

//   const rewriteTextPromise: Promise<Record<string, any>> = new Promise(
//     function (resolve, reject) {
//       makePostRequest(url, data)
//         .then((res) => {
//           const rewrittenText = res.data;

//           resolve({
//             textToChange: textToChange,
//             rewrittenText: rewrittenText,
//           });
//         })
//         .catch((err) => {
//           // log error
//           console.error(err);
//           // bug return original text
//           resolve({
//             textToChange: textToChange,
//             rewrittenText: textToChange,
//           });
//         });
//     },
//   );

//   return rewriteTextPromise;
// };

// /**
//  * Given an HTML paragraph that may or may not contain HTML tags,
//  * clean it to make it a plain text paragraph
//  * @param text
//  * @returns
//  */
// const cleanParagraphForRewrite = (text: String) => {
//   // remove all <h1> ... </h1> tags
//   let newText = text.replace(/<h1>.*?<\/h1>/g, "");

//   // remove <h1 class="tiptap-heading">...</h1>
//   newText = newText.replace(/<h1 class="tiptap-heading">.*?<\/h1>/g, "");

//   // remove all <strong> ... </strong>, <em> ... </em>, <italic> ... </italic> tags
//   newText = newText.replace(/<strong>.*?<\/strong>/g, "");
//   newText = newText.replace(/<em>.*?<\/em>/g, "");
//   newText = newText.replace(/<italic>.*?<\/italic>/g, "");

//   return newText
//     .replace("<p>", "")
//     .replace("</p>", "")
//     .replace(`<p class="tiptap-paragraph">`, "")
//     .replace(`<p class="tiptap-paragraph"></p>`, "")
//     .replace(`<h1 class="tiptap-heading"></h1>`, "");
// };

// /**
//  * Converts from HTML into string paragraphs array
//  * @param htmlText
//  * @returns array of string paragraphs ["", ...]
//  */
// export const splitHTMLIntoParagraphs = (
//   htmlText: String,
//   currDocData: Record<string, any> = {},
// ) => {
//   let paragraphs = htmlText.split("</p>");

//   let filteredParagraphs = [];

//   // for each paragraph, remove the <p> tag
//   for (let i = 0; i < paragraphs.length; i++) {
//     const paragraph = paragraphs[i];

//     const wordsInParagraph = getTextWordCount(
//       paragraph,
//       currDocData?.language?.toLowerCase() ?? "english",
//     );

//     // if less than 10 words, skip
//     if (wordsInParagraph < MIN_WORDS_TO_REWRITE_PARAGRAPH) {
//       continue;
//     }

//     let newParagraph = paragraph.replace("<p>", "");
//     newParagraph = paragraph.replace(`<p class="tiptap-paragraph">`, "");
//     newParagraph = paragraph.replace(`</p>`, "");
//     filteredParagraphs.push(newParagraph);
//   }

//   // remove all <p> tags
//   filteredParagraphs = filteredParagraphs.map((paragraph) => {
//     return cleanParagraphForRewrite(paragraph);
//   });

//   return filteredParagraphs;
// };

// export const groupStringParagraphsForClassicRewrite = (
//   paragraphs: string[],
//   currDocData: Record<string, any> = {},
// ): Record<string, any> => {
//   let groupedParagraphs: string[] = [];
//   let groupedParagraphsSubarray: string[][] = [];
//   let numbParagraphsInGroups: number[] = [];
//   let currentGroup = "";
//   let currentGroupSubarray: string[] = [];
//   let currentGroupWordCount = 0;
//   let numbParagraphsInCurrentGroup = 0;

//   const MIN_WORDS = 120;
//   const MAX_WORDS = 200;

//   paragraphs.forEach((paragraph) => {
//     const paragraphWordCount = getTextWordCount(
//       paragraph,
//       currDocData?.language?.toLowerCase() ?? "english",
//     );

//     // if less than 10 words, skip
//     if (paragraphWordCount < MIN_WORDS_TO_REWRITE_PARAGRAPH) {
//       return;
//     }

//     // if combined less than 350, add to current group
//     if (currentGroupWordCount + paragraphWordCount <= MAX_WORDS) {
//       currentGroup += "\n\n" + paragraph;
//       currentGroupWordCount += paragraphWordCount;
//       currentGroupSubarray.push(paragraph);
//       numbParagraphsInCurrentGroup += 1;
//     } else {
//       // if current group is less than 180, add to current group
//       if (currentGroupWordCount < MIN_WORDS) {
//         currentGroup += "\n\n" + paragraph;
//         currentGroupWordCount += paragraphWordCount;
//         currentGroupSubarray.push(paragraph);
//         numbParagraphsInCurrentGroup += 1;
//       } else {
//         // otherwise, start a new group and push old one
//         groupedParagraphs.push(currentGroup);
//         numbParagraphsInGroups.push(numbParagraphsInCurrentGroup);
//         groupedParagraphsSubarray.push(currentGroupSubarray);
//         currentGroup = paragraph;
//         currentGroupWordCount = paragraphWordCount;
//         numbParagraphsInCurrentGroup = 1;
//         currentGroupSubarray = [paragraph];
//       }
//     }
//   });

//   if (currentGroupWordCount > 0) {
//     groupedParagraphs.push(currentGroup);
//     groupedParagraphsSubarray.push(currentGroupSubarray);
//     numbParagraphsInGroups.push(numbParagraphsInCurrentGroup);
//   }

//   return {
//     groupedParagraphs,
//     numbParagraphsInGroups,
//   };
// };

// export const getRewrittenParagraphReqId = (
//   url: string,
//   paragraph: String,
//   academicLevel: string = "high school",
//   bypassFocus: string = "gptzero",
//   currDocData: Record<string, any> = {},
//   rehumanizeFeedback = "",
// ): Promise<Record<string, any>> => {
//   // parameters to pass to the backend for rewrite

//   const style =
//     useEnhanceSettings?.getState()?.style?.toLowerCase() ?? "standard";
//   const data = {
//     query: paragraph, // the actual text being rewritten
//     // additional parameters
//     academicLevel,
//     style,
//     bypassFocus,
//     currDocData,
//     rehumanizeFeedback,
//   };

//   const promise: Promise<Record<string, any>> = new Promise(function (
//     resolve,
//     reject,
//   ) {
//     makePostRequest(url, data)
//       .then((res) => {
//         if (res.status === 402) {
//           resolve({
//             statusWith402: true,
//           });
//           return;
//         }
//         const reqId = res.data;
//         resolve({
//           reqId,
//           textToChange: paragraph,
//         });
//       })
//       .catch((err) => {
//         if (err.response?.status === 402) {
//           resolve({
//             statusWith402: true,
//           });
//           return;
//         } else {
//           resolve({});
//         }
//         console.error("Error in rewrite sentence promise");
//         console.log(err);
//         reject(err);
//       });
//   });

//   return promise;
// };

// export const getRewrittenParagraphResponse = (
//   textToChange: String,
//   reqId: string,
// ): Promise<Record<string, any>> => {
//   const data = {
//     reqId,
//   };

//   const promise: Promise<Record<string, any>> = new Promise(function (
//     resolve,
//     reject,
//   ) {
//     makePostRequest(
//       `${SECOND_BACKEND_URL}/ai/bypasser/get-bypass-paragraph-response`,
//       data,
//     )
//       .then((res) => {
//         const response = res.data;

//         // if not processed, don't return rewritten text
//         if (!response.processed) {
//           resolve({
//             reqId,
//             textToChange,
//           });
//           return;
//         }

//         // otherwise, return rewritten text
//         resolve({
//           reqId,
//           textToChange,
//           rewrittenText: response.response,
//         });
//       })
//       .catch((err) => {
//         console.error("Error in rewrite sentence promise");
//         console.log(err);
//         // just resolve back the original text
//         resolve({
//           reqId,
//           textToChange,
//           rewrittenText: textToChange,
//         });
//       });
//   });

//   return promise;
// };

// /**
//  * Gets the bypass endpoint based on the parameter given
//  * @param bypassFocus - gptzero / turnitin / originality
//  * @returns string - full url of the bypass endpoint
//  */
// const getBypasserUrl = (
//   bypassFocus: string = "gptzero",
//   bypassMethod: string = "method1",
// ) => {
//   return `${SECOND_BACKEND_URL}/ai/bypasser/bypass-paragraph`;
// };

// const groupParagraphsWithPerplexities = (
//   paragraphs: String[],
//   pplPerSentence: Record<string, any>[],
// ) => {
//   const paragraphsWithPerplexities: Record<string, any>[] = [];

//   let j = 0;

//   // for each paragraph
//   for (let i = 0; i < paragraphs.length; i++) {
//     const paragraph = paragraphs[i];

//     const paragraphPplPerSentence = [];

//     // if paragraph is empty or less than 10 characters, skip
//     if (paragraph === "" || paragraph.length < 15) {
//       continue;
//     }

//     // while j is in range, see if sentence is in paragraph and if so,
//     // add it to this paragraph's perplexities
//     while (j < pplPerSentence.length) {
//       const ppl: Record<string, any> = pplPerSentence[j];

//       // if the ppl is in the paragraph, add it to the paragraph
//       if (paragraph.includes(ppl.sentence)) {
//         paragraphPplPerSentence.push(ppl);
//         j++;
//       } else {
//         // break the moment a paragraph not in the sentence found
//         break;
//       }
//     }

//     paragraphsWithPerplexities.push({
//       paragraph,
//       paragraphPplPerSentence,
//     });
//   }

//   return paragraphsWithPerplexities;
// };

// export const getHeadingsFromHTML = (htmlText: String) => {
//   const headings = htmlText.match(/<h[1-6].*?>.*?<\/h[1-6]>/g) || [];
//   console.log("HEADINGS:");
//   console.log(headings);
//   return headings;
// };

// /**
//  * Latest method being used that splits it into paragraphs
//  * Groups paragraphs based on minimum words or maximum words for classic method1
//  * Or, if not classic, just sends each paragraph individually
//  * And then replaces the old paragraphs with the newly written ones
//  * @param originalText
//  * @param pplPerSentence
//  * @param academicLevel
//  * @param bypassFocus
//  * @param bypassMethod
//  * @returns
//  */
// export const rewriteAllSentencesMethod1ByParagraph = async (
//   originalText: string,
//   pplPerSentence: Record<string, any>[] = [],
//   academicLevel: string = "high school",
//   bypassFocus: string = "gptzero",
//   bypassMethod: string = "method1",
//   currDocData: Record<string, any> = {},
//   rehumanizeFeedback: string = "",
// ): Promise<string | boolean> => {
//   const ROTATING_ENABLED = true;
//   const FORCED_TESTING_MODEL = "";

//   const humanizedCount = currDocData?.humanizedCount || 0;

//   // NOTE: for normal gptzero, depending on the humanize count: 0, 1, 2, will rotate different bypass methods by itself
//   if (bypassFocus == "gptzero" && ROTATING_ENABLED) {
//     switch (humanizedCount % 5) {
//       case 0:
//         bypassFocus = "gptzero-bankai"; // bankai model first 2 times
//         break;
//       case 1:
//         bypassFocus = "gptzero"; // then normal gpt
//         break;
//       case 2:
//         bypassFocus = "gptzero-bankai"; // then bankai gpt again
//         break;
//       case 3:
//         bypassFocus = "turnitin"; // then turnitin
//         break;
//       case 4:
//         bypassFocus = "gptzero alternate"; // then try after that
//         break;
//     }
//   } else if (
//     (bypassFocus == "turnitin" || bypassFocus == "originality") &&
//     ROTATING_ENABLED
//   ) {
//     // start with gptzero, then turnitin, then gptzero alternate
//     switch (humanizedCount % 5) {
//       case 0:
//         bypassFocus = "gptzero-bankai"; // bankai model first 2 times
//         break;
//       case 1:
//         bypassFocus = "gptzero"; // then normal gpt
//         break;
//       case 2:
//         bypassFocus = "gptzero-bankai"; // then bankai gpt again
//         break;
//       case 3:
//         bypassFocus = "turnitin"; // then try after that
//         break;
//       case 4:
//         bypassFocus = "gptzero alternate"; // then try after that
//         break;
//     }
//   }

//   // if forced testing model, override to that
//   if (FORCED_TESTING_MODEL) {
//     bypassFocus = FORCED_TESTING_MODEL;
//   }

//   const url = getBypasserUrl(bypassFocus, bypassMethod);

//   const htmlText = convertTextToHTML(originalText as string);
//   let newHTML = htmlText;

//   let paragraphsToSendToEnhancer = divideTextInto75To100Words(
//     originalText as string,
//   );

//   console.log("PARAGRAPHS SPLIT: ");
//   console.log(paragraphsToSendToEnhancer);

//   const promises = [];

//   // for each paragraph, create a promise that sends the paragraph to the backend
//   // to be rewritten and gets the request id to ping the backend with to check if task is done
//   for (let i = 0; i < paragraphsToSendToEnhancer.length; i++) {
//     const paragraph = paragraphsToSendToEnhancer[i];

//     // if paragraph is empty or less than 40 characters, skip
//     if (paragraph === "" || paragraph.length < 40) {
//       continue;
//     }

//     // push the promise to be rewritten
//     promises.push(
//       getRewrittenParagraphReqId(
//         url,
//         paragraph,
//         academicLevel,
//         bypassFocus,
//         {
//           ...currDocData,
//           paragraphPosition:
//             i !== paragraphsToSendToEnhancer.length - 1 ? i : -1, // -1 to indicate last paragraph
//         },
//         rehumanizeFeedback,
//       ),
//     );
//   }

//   // wait for all promises to resolve
//   const results: any = await Promise.all(promises);

//   // if 402 returned for first, payment required, return true to cause
//   // payment modal to be shown since a non-string is returned
//   if (results[0]?.statusWith402) {
//     return true;
//   }

//   // now all the returned requests have a reqId
//   let textsToChangeWithReqId: Record<string, any>[] = [];

//   // this will be used to store the incoming successful results from the polling
//   // use reqId: returned successful result to maintian order of sent paragraphs
//   let resolvedTextsToChange: Record<string, Record<string, any>> = {};
//   // this one is an array version of the above, not used in order
//   let successfullyResolvedTextsToChange: Record<string, any>[] = [];

//   // check if any had error in them
//   for (let i = 0; i < results.length; i++) {
//     const result = results[i];

//     // see if result is an error
//     if (result instanceof Error) {
//       // Log and skip this result
//       console.error("Result promise error for rewrite");
//       console.log(result);
//       continue;
//     } else {
//       textsToChangeWithReqId.push(result);
//       // store this entry in resolvedTextsToChange so it can be updated during polling on successful response
//       resolvedTextsToChange[result["reqId"]] = result;
//     }
//   }

//   // wait 7 seconds before making the 1st request to check if reqId is done
//   await new Promise((r) => setTimeout(r, 5000));

//   // try for up to 10 times
//   let MAX_TRIES = 10;
//   const TIME_BETWEEN_EACH_RETRY = 7500;

//   // until MAX_TRIES keep pinging the backend to see if the reqId is done
//   for (let i = 0; i < MAX_TRIES; i++) {
//     const promises = [];

//     // for each reqId, push a promise to check if it is done
//     for (let i = 0; i < textsToChangeWithReqId.length; i++) {
//       const textToChangeWithReqId = textsToChangeWithReqId[i];
//       const reqId = textToChangeWithReqId["reqId"];
//       const textToChange = textToChangeWithReqId["textToChange"];

//       promises.push(getRewrittenParagraphResponse(textToChange, reqId));
//     }

//     // wait for all promises to resolve
//     const results: any = await Promise.all(promises);

//     // reset textsToChangeWithReqId
//     textsToChangeWithReqId = [];

//     // for all the promises that resolved with a status of done, add it to resolvedTextsToChange
//     for (let i = 0; i < results.length; i++) {
//       const result = results[i];

//       // see if result is an error
//       if (result instanceof Error) {
//         // Log and skip this result
//         console.error("Result promise error for rewrite");
//         console.log(result);
//         continue;
//       }
//       // if reqId is not done, add it back to textsToChangeWithReqId to poll again
//       else if (result["rewrittenText"] === undefined) {
//         textsToChangeWithReqId.push(result);
//       }
//       // otherwise, this has been rewritten and can be added to resolvedTextsToChange
//       else {
//         resolvedTextsToChange[result?.reqId] = result;
//         successfullyResolvedTextsToChange.push(result);
//       }
//     }

//     // if all reqIds are done, stop interval
//     if (textsToChangeWithReqId.length === 0) {
//       // exit loop
//       break;
//     }

//     // wait 7 seconds before trying again
//     await new Promise((r) => setTimeout(r, TIME_BETWEEN_EACH_RETRY));
//   }

//   // from here on out use array version
//   const orderedResolvedTextsToChange = Object.values(resolvedTextsToChange);

//   if (bypassFocus != "gptzero alternate") {
//     // replace the entire essay for classic through chronological order
//     return replaceParagraphsWithRewrittenOnes(
//       newHTML,
//       orderedResolvedTextsToChange,
//       paragraphsToSendToEnhancer,
//       [],
//     );
//   } else {
//     console.log("NON CLASSIC REPLACING!");
//     console.log(orderedResolvedTextsToChange);

//     // for non-Classic, just replace each old paragraph with new one returned
//     for (let i = 0; i < orderedResolvedTextsToChange.length; i++) {
//       try {
//         const textToChange = orderedResolvedTextsToChange[i]["textToChange"];
//         const rewrittenText = orderedResolvedTextsToChange[i]["rewrittenText"];

//         // split textToChange into paragraphs
//         const paragraphsOld = textToChange.split("\n\n");
//         const paragraphsNew = rewrittenText.split("\n\n");

//         // filter out empty ones
//         const filteredParagraphsOld = paragraphsOld.filter(
//           (paragraph: string) => paragraph !== "",
//         );

//         // now for each paragraph, replace the old one with the new one
//         for (let i = 0; i < filteredParagraphsOld.length; i++) {
//           const paragraphOld = filteredParagraphsOld[i];
//           const paragraphNew = paragraphsNew[i];

//           newHTML = newHTML.replace(paragraphOld, paragraphNew);
//         }
//       } catch (err) {
//         console.error("Error in rewriteAllSentencesMethod1ByParagraph: ", err);
//       }
//     }
//   }
//   return newHTML.replaceAll("<p></p>", "");
// };

// // replace the old paragraphs with old ones
// const replaceParagraphsWithRewrittenOnes = (
//   newHTML: String,
//   resolvedTextsToChange: Record<string, any>[],
//   stringParagraphsSplit: string[],
//   numbParagraphsInGroups: number[],
// ) => {
//   console.log("NEW HTML: ");
//   console.log(newHTML);

//   console.log("TEXTS TO CHANGE: ");
//   console.log(resolvedTextsToChange);

//   const headings = getHeadingsFromHTML(newHTML);

//   let completelyNewHTML = "";
//   let currHeadingIndex = 0;

//   for (let i = 0; i < resolvedTextsToChange.length; i++) {
//     // get the rewritten paragraphs for this request
//     const rewrittenParagraphs = resolvedTextsToChange[i]?.rewrittenText ?? null;
//     if (rewrittenParagraphs) {
//       try {
//         const parsedRewrittenParagraphs = JSON.parse(rewrittenParagraphs);

//         parsedRewrittenParagraphs.forEach((rewrittenParagraph: string) => {
//           if (rewrittenParagraph) {
//             if (
//               currHeadingIndex < headings.length &&
//               headings[currHeadingIndex]
//             ) {
//               completelyNewHTML += `<h1>${headings[currHeadingIndex]}</h1>`;
//               currHeadingIndex++;
//             }
//             completelyNewHTML += `<p>${rewrittenParagraph}</p> <br />`;
//           }
//         });
//       } catch (err) {
//         console.log(
//           "ERROR PARSING REWRITTEN PARAGRAPHS | INPUT:",
//           rewrittenParagraphs,
//         );
//       }
//     }
//   }

//   console.log("NEW HTML:");
//   console.log(completelyNewHTML);

//   return completelyNewHTML.replaceAll("<p></p>", "");
// };

// // Rewriting tool method
// export const rewriteAllMethod3 = async (
//   originalText: String,
// ): Promise<String> => {
//   // setUsedRewriterInDB();

//   const url = getBypasserUrl();

//   const htmlText = convertTextToHTML(originalText as string);
//   let newHTML = htmlText;

//   const promises = [];

//   promises.push(getRewrittenParagraphReqId(url, originalText));

//   // wait for all promises to resolve
//   const results: any = await Promise.all(promises);

//   let textsToChangeWithReqId: Record<string, any>[] = [];

//   for (let i = 0; i < results.length; i++) {
//     const result = results[i];

//     // see if result is an error
//     if (result instanceof Error) {
//       // Log and skip this result
//       console.error("Result promise error for rewrite");
//       console.log(result);
//       continue;
//     } else {
//       textsToChangeWithReqId.push(result);
//     }
//   }

//   // { textToChange, rewrittenText, reqId }
//   let resolvedTextsToChange: Record<string, any>[] = [];

//   // wait 7 seconds before making the 1st request
//   await new Promise((r) => setTimeout(r, 7000));

//   // try for up to 10 times
//   let MAX_TRIES = 10;
//   for (let i = 0; i < MAX_TRIES; i++) {
//     const promises = [];

//     for (let i = 0; i < textsToChangeWithReqId.length; i++) {
//       const textToChangeWithReqId = textsToChangeWithReqId[i];
//       const reqId = textToChangeWithReqId["reqId"];
//       const textToChange = textToChangeWithReqId["textToChange"];

//       promises.push(getRewrittenParagraphResponse(textToChange, reqId));
//     }

//     // wait for all promises to resolve
//     const results: any = await Promise.all(promises);

//     // reset textsToChangeWithReqId
//     textsToChangeWithReqId = [];

//     for (let i = 0; i < results.length; i++) {
//       const result = results[i];

//       // see if result is an error
//       if (result instanceof Error) {
//         // Log and skip this result
//         console.error("Result promise error for rewrite");
//         console.log(result);
//         continue;
//       } // if reqId is not done, add it back to textsToChangeWithReqId
//       else if (result["rewrittenText"] === undefined) {
//         textsToChangeWithReqId.push(result);
//       } else {
//         resolvedTextsToChange.push(result);
//       }
//     }

//     toast.remove();
//     toast.success(
//       `Still rewriting...the longer the entire text, the more time it takes.`,
//       { duration: 3000 },
//     );

//     console.log("Iteration: " + i);
//     console.log(resolvedTextsToChange);
//     console.log(textsToChangeWithReqId);

//     // if all reqIds are done, stop interval
//     if (textsToChangeWithReqId.length === 0) {
//       // exit loop
//       break;
//     }

//     // wait 9 seconds before trying again
//     await new Promise((r) => setTimeout(r, 9000));
//   }

//   // replace all textsToChange with rewrittenText
//   for (let i = 0; i < resolvedTextsToChange.length; i++) {
//     const textToChange = resolvedTextsToChange[i]["textToChange"];
//     const rewrittenText = resolvedTextsToChange[i]["rewrittenText"];

//     const htmlText = convertTextToHTML(rewrittenText);
//     return htmlText;
//   }

//   toast.error(
//     `Erorr rewriting text. Please try decreasing the length of the essay. Submit a ticket on Discord if still not working, and we would be happy to help.`,
//     { duration: 10000 },
//   );
//   return newHTML.replaceAll("<p></p>", "");
// };

// // TODO: find way to combine clump beside just spaces in between
// const combineSentencesOfCurrentClump = (currClump: []) => {
//   let combinedSentence = "";
//   for (let i = 0; i < currClump.length; i++) {
//     combinedSentence += currClump[i]["sentence"] + " ";
//   }
//   // Remove last space
//   combinedSentence = combinedSentence.slice(0, -1);
//   return combinedSentence;
// };

// export const getTextHTMLWithHighLight = (
//   sentence: string,
//   perplexity: number,
// ) => {
//   let newHTML = sentence;
//   const highlightColor =
//     perplexity <= RED_PERPLEXITY_MAX ? RED_HIGHLIGHT : "rgb(254, 249, 204)";

//   return `<mark data-color="${highlightColor}" style="background-color: ${highlightColor}; color: inherit">${sentence}</mark>`;
// };

// export const rewriteSingleSentenceInHTML = async (
//   currEditorHTML: string,
//   sentence: string,
//   perplexity: number,
// ) => {
//   setUsedRewriterInDB();

//   let newHTML = currEditorHTML;

//   const sentenceToChange = sentence;
//   const sentenceToChangeWithHighlight = getTextHTMLWithHighLight(
//     sentenceToChange,
//     perplexity,
//   );

//   const data = {
//     query: sentenceToChange,
//   };

//   let rewrittenSentence, new_perplexity;

//   // call rewrite api
//   try {
//     const rewriter_res = await makePostRequest(
//       `${SECOND_BACKEND_URL}/ai/bypasser/rewrite-sentence-webapp`,
//       data,
//     );
//     rewrittenSentence = rewriter_res.data;

//     // Replace sentence with new one
//     newHTML = newHTML.replace(sentenceToChangeWithHighlight, rewrittenSentence);
//   } catch (err) {
//     console.log(err);
//     return { newHTML, rewrittenSentence };
//   }

//   return { newHTML, rewrittenSentence };
// };

// export const deleteSingleSentenceInHTML = (
//   currEditorHTML: string,
//   sentence: string,
//   perplexity: number,
// ) => {
//   let newHTML = currEditorHTML;

//   const sentenceToChange = sentence;
//   const sentenceToChangeWithHighlight = getTextHTMLWithHighLight(
//     sentenceToChange,
//     perplexity,
//   );

//   // Remove sentence
//   newHTML = newHTML.replace(sentenceToChangeWithHighlight, "");

//   return newHTML.replaceAll("<p></p>", "");
// };

// export const rewriteParagraphInHTML = async (
//   originalText: string,
//   text: string,
// ): Promise<Record<string, any>> => {
//   setUsedRewriterInDB();

//   const htmlText = convertTextToHTML(originalText);
//   let newHTML = htmlText;

//   const url = getBypasserUrl();
//   const { reqId, textToChange: paragraph } = await getRewrittenParagraphReqId(
//     url,
//     text,
//   );

//   let result = null;

//   for (let i = 0; i < 5; i++) {
//     const res = await getRewrittenParagraphResponse(paragraph, reqId);
//     if (res.rewrittenText) {
//       result = res;
//       break;
//     }
//     // sleep for 3 seconds
//     await new Promise((resolve) => setTimeout(resolve, 3000));
//   }

//   if (!result) {
//     return { newHTML, rewrittenText: paragraph };
//   }

//   const textToChange = result["textToChange"];
//   const rewrittenText = result["rewrittenText"];

//   newHTML = newHTML.replace(textToChange, rewrittenText);

//   return { newHTML, rewrittenText };
// };

// // Grammar fix
// export const rewriteTextToFixGrammarInHTML = (
//   textHTML: string,
//   originalText: string,
//   newText: string,
// ): string => {
//   const highlightColor = `rgb(208, 182, 94)`;
//   const originalTextHTML = `<mark data-color="${highlightColor}" style="background-color: ${highlightColor}; color: inherit">${originalText}</mark>`;
//   let newHTML = textHTML;
//   newHTML = newHTML.replace(originalTextHTML, newText);
//   return newHTML.replaceAll("<p></p>", "");
// };

// // Text Improvement fix
// export const rewriteTextToFixTextImprovementInHTML = (
//   textHTML: string,
//   originalText: string,
//   newText: string,
// ): string => {
//   const highlightColor = `rgb(121, 184, 216)`;
//   const originalTextHTML = `<mark data-color="${highlightColor}" style="background-color: ${highlightColor}; color: inherit">${originalText}</mark>`;
//   let newHTML = textHTML;
//   newHTML = newHTML.replace(originalTextHTML, newText);
//   return newHTML.replaceAll("<p></p>", "");
// };

// // AI remove highlight
// export const removeAIHighlights = (
//   textHTML: string,
//   originalText: string,
// ): string => {
//   const highlightColor = `rgb(208, 97, 94)`;
//   const originalTextWithHighlight = `<mark data-color="${highlightColor}" style="background-color: ${highlightColor}; color: inherit">${originalText}</mark>`;
//   let newHTML = textHTML;
//   newHTML = newHTML.replace(originalTextWithHighlight, originalText);
//   return newHTML;
// };

// export const removeAllMarksFromHTML = (textHTML: string): string => {
//   try {
//     return textHTML.replaceAll(/<mark[^>]*>(.*?)<\/mark>/g, "$1");
//   } catch (err) {
//     console.error(err);
//     return textHTML;
//   }
// };

// // Grammar remove highlight
// export const removeGrammarHighlightInHTML = (
//   textHTML: string,
//   originalText: string,
// ): string => {
//   const highlightColor = `rgb(254, 249, 204)`;
//   const originalTextWithHighlight = `<mark data-color="${highlightColor}" style="background-color: ${highlightColor}; color: inherit">${originalText}</mark>`;
//   let newHTML = textHTML;
//   newHTML = newHTML.replace(originalTextWithHighlight, originalText);
//   return newHTML.replaceAll("<p></p>", "");
// };

// // Text improvement remove highlight
// export const removeTextImprovementHighlightInHTML = (
//   textHTML: string,
//   originalText: string,
// ): string => {
//   const highlightColor = `rgb(121, 184, 216)`;
//   const originalTextWithHighlight = `<mark data-color="${highlightColor}" style="background-color: ${highlightColor}; color: inherit">${originalText}</mark>`;
//   let newHTML = textHTML;
//   newHTML = newHTML.replace(originalTextWithHighlight, originalText);
//   return newHTML.replaceAll("<p></p>", "");
// };

// export const setUsedRewriterInDB = async () => {
//   const firebaseUser: any = await getCurrentFirebaseUser();

//   if (firebaseUser) {
//     const email = firebaseUser.email;
//     await makePostRequest(`${SECOND_BACKEND_URL}/auth/used-rewriter`, {
//       email,
//     }).catch((err) => console.log(err));
//   }
// };
