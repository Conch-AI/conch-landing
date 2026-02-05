// import { LOCAL_STORAGE_KEY } from "@/helpers/browser/local-storage";
// import { makePostRequest } from "@/helpers/browser/requests";
// import {
//   AI_WRITTEN_MESSAGE,
//   CHECKER_BACKEND_URL,
//   GRAMMAR_IMPROVEMENT_SCORE_PENALTY,
//   HUMAN_WRITTEN_MESSAGE,
//   MOSTLY_HUMAN_MESSAGE,
//   RED_HIGHLIGHT,
//   RED_PERPLEXITY_MAX,
//   RED_SCORE_MAX,
//   SECOND_BACKEND_URL,
//   TEXT_IMPROVEMENT_SCORE_PENALTY,
//   YELLOW_PERPLEXITY_MAX,
//   YELLOW_SCORE_MAX,
// } from "@/helpers/shared/constants";
// import { convertTextToHTML } from "@/helpers/write/editor-content";

// export const sendCheckDocumentRequestToBackend = async (
//   data: Record<string, any>,
// ): Promise<Record<string, any>> => {
//   // return promise
//   return new Promise((resolve, reject) => {
//     makePostRequest(`${CHECKER_BACKEND_URL}/checker/check-per-line`, data)
//       .then(async (res) => {
//         if (
//           Array.isArray(res.data) &&
//           res.data.length > 0 &&
//           res.data[0]?.toLowerCase().includes("error with")
//         ) {
//           throw "Error in main check per line";
//         }
//         resolve(res);
//       })
//       .catch((e) => {
//         makePostRequest(
//           `${SECOND_BACKEND_URL}/ai/checker/check-for-ai-method-1`,
//           data,
//         )
//           .then(async (res) => {
//             resolve(res);
//           })
//           .catch((e) => reject(e));
//       });
//   });
// };

// export const addPerplexityHighlightsToHTML = (
//   originalHTML: String,
//   pplPerSentence: Record<string, any>[],
// ) => {
//   let newHTML = originalHTML;

//   // Loop through key, val of pplPerSentence
//   for (let i = 0; i < pplPerSentence.length; i++) {
//     const sentence = pplPerSentence[i]["sentence"];
//     const perplexity = pplPerSentence[i]["perplexity"];

//     if (perplexity <= YELLOW_PERPLEXITY_MAX) {
//       const highlightColor =
//         perplexity <= RED_PERPLEXITY_MAX
//           ? RED_HIGHLIGHT + ";"
//           : "rgb(254, 249, 204)";

//       // Add highlight to sentence
//       newHTML = newHTML.replace(
//         `${sentence}`,
//         `<mark style="background: ${highlightColor}">${sentence}</mark>`,
//       );
//     }
//   }

//   return newHTML;
// };

// // A percentage score of how much of the text is AI written (0-100)
// // but not exactly a percentage, because rewrite all gives an artifical boost to it
// export const calculateScoreFromPPL = (
//   pplPerSentence: Record<string, any>[],
// ) => {
//   let numbSentences = pplPerSentence.length;

//   let numbSentencesRed, numbSentencesYellow, numbSentencesPassing;
//   numbSentencesRed = numbSentencesYellow = numbSentencesPassing = 0;

//   for (let i = 0; i < numbSentences; i++) {
//     const perplexity = pplPerSentence[i]["perplexity"];

//     if (perplexity <= RED_PERPLEXITY_MAX) {
//       numbSentencesRed++;
//     } else {
//       numbSentencesPassing++;
//     }
//   }

//   // 1 * numb sentences passing + 0.5 * numb sentences yellow divided by total numb sentences
//   const finalScore = Math.round(
//     ((1 * numbSentencesPassing) / numbSentences) * 100,
//   );

//   return finalScore;
// };

// // A percentage score of how much of the text is AI written (0-100)
// // but not exactly a percentage, because rewrite all gives an artifical boost to it
// export const getPercentageOfTextAI = (
//   pplPerSentence: Record<string, any>[],
// ) => {
//   let numbSentences = pplPerSentence.length;

//   let numbSentencesRed, numbSentencesYellow, numbSentencesPassing;
//   numbSentencesRed = numbSentencesYellow = numbSentencesPassing = 0;

//   for (let i = 0; i < numbSentences; i++) {
//     const perplexity = pplPerSentence[i]["perplexity"];

//     if (perplexity <= RED_PERPLEXITY_MAX) {
//       numbSentencesRed++;
//     } else if (perplexity <= YELLOW_PERPLEXITY_MAX) {
//       numbSentencesYellow++;
//     } else {
//       numbSentencesPassing++;
//     }
//   }

//   // 1 * numb sentences passing + 0.5 * numb sentences yellow divided by total numb sentences
//   const finalScore = Math.round(
//     ((1.0 * numbSentencesRed) / numbSentences) * 100,
//   );

//   return finalScore;
// };

// export const scoreAfterGrammarAndTextImprovements = (
//   score: number,
//   grammarImprovements: Record<string, any>[],
//   textImprovements: Record<string, any>[],
// ) => {
//   const grammarScoreSubtract = grammarImprovements
//     ? grammarImprovements.length * GRAMMAR_IMPROVEMENT_SCORE_PENALTY
//     : 0;
//   const textScoreSubtract = textImprovements
//     ? textImprovements.length * TEXT_IMPROVEMENT_SCORE_PENALTY
//     : 0;
//   // subtract 1 point for each grammar and text improvement
//   return score - grammarScoreSubtract - textScoreSubtract;
// };

// /**
//  * Create our score of red, yellow, green on
//  * how AI-based their text
//  * @param originalText
//  * @param pplPerSentence
//  * @returns
//  */
// export const generatePerplexityHighlightsHTMLFromText = (
//   originalText: string,
//   pplPerSentence: Record<string, any>[],
// ) => {
//   // First convert to html
//   const htmlText = convertTextToHTML(originalText);

//   // Then add perplexity highlights
//   return addPerplexityHighlightsToHTML(htmlText, pplPerSentence);
// };

// /**
//  * Based on the score, return if AI written, mostly human, or human written
//  * @param score 0 to 100
//  * @returns
//  */
// export const generateMessageFromScore = (score: number) => {
//   if (score <= RED_SCORE_MAX) {
//     return AI_WRITTEN_MESSAGE;
//   } else if (score <= YELLOW_SCORE_MAX) {
//     return MOSTLY_HUMAN_MESSAGE;
//   } else {
//     return HUMAN_WRITTEN_MESSAGE;
//   }
// };

// /**
//  * Based on the score, return if AI written, mostly human, or human written
//  * @param score 0 to 100
//  * @returns
//  */
// export const generateOutputMessage = (
//   score: number,
//   pplPerSentence: Record<string, any>,
//   grammarImprovements: Record<string, any>[],
//   textImprovements: Record<string, any>[],
// ) => {
//   const grammarErrorRatio = grammarImprovements.length / pplPerSentence.length;
//   const styleErrorRatio = textImprovements.length / pplPerSentence.length;

//   let message = "";

//   // TODO: if score is low because of grammar problems, say that instead of AI written
//   if (score <= RED_SCORE_MAX) {
//     // Would not pass AI detector
//     message = AI_WRITTEN_MESSAGE;
//   } else {
//     // Count the number of pplPerSentence that are red
//     let numbRed = 0;
//     for (let i = 0; i < pplPerSentence.length; i++) {
//       const perplexity = pplPerSentence[i]["perplexity"];

//       if (perplexity <= RED_PERPLEXITY_MAX) {
//         numbRed++;
//       }
//     }

//     // If more than 30% sentences are red, add a warning
//     if (numbRed / pplPerSentence.length > 0.3) {
//       message +=
//         "You have a decent essay, but there are significant AI problems.";
//     } else if (grammarErrorRatio <= 0.3 && styleErrorRatio <= 0.3) {
//       // Both ratios are low
//       message = "You have a strong, natural essay!";
//     } else if (grammarErrorRatio > 0.3 && styleErrorRatio > 0.3) {
//       // Both are very high
//       message = "Your essay has quite a few grammar / style problems.";
//     } else if (grammarErrorRatio > 0.3) {
//       // Only grammar is high
//       message = "Your essay has quite a few grammar problems.";
//     } else {
//       // Only text is high
//       message = "Your essay has quite a few style problems.";
//     }
//   }

//   return message;
// };

// /*
//   NEW: V2.0.0 Below with AI Checker + Improvements
// */
// export const generateHighlightsFromText = (
//   originalText: string,
//   pplPerSentence: Record<string, any>[],
//   improvementsGrammar: any[],
//   improvementsText: any[],
//   AIhighlightColor = RED_HIGHLIGHT,
//   grammarHighlightColor = RED_HIGHLIGHT,
// ) => {
//   // First convert to html
//   const htmlText: string = convertTextToHTML(originalText);

//   // Then add perplexity highlights
//   return addAllHightsToText(
//     htmlText,
//     pplPerSentence,
//     improvementsGrammar,
//     improvementsText,
//     AIhighlightColor,
//     grammarHighlightColor,
//   );
// };

// const replace_nth = function (s: String, f: string, r: string, n: number) {
//   // From the given string s, find f, replace as r only on n’th occurrence
//   return s.replace(RegExp("^(?:.*?" + f + "){" + n + "}"), (x) =>
//     x.replace(RegExp(f + "$"), r),
//   );
// };

// /**
//  * Replace only by whole word (not by partial match)
//  * @param s
//  * @param f
//  * @param r
//  */
// const replaceWholeWordOnly = (s: String, f: string, r: string) => {
//   return s.replace(RegExp(`(?<=\\s|^)${f}(?=\\s|$|\\.|,|;|:|!|\\?)`), r);
// };

// export const addAllHightsToText = (
//   originalHTML: string,
//   pplPerSentence: Record<string, any>[],
//   improvementsGrammar: any[],
//   improvementsText: any[],
//   grammarHighlightColor: any,
//   AIHighlightColor: any,
// ) => {
//   let newHTML = originalHTML;

//   // Store the grammar and text improvements that WERE highlighted
//   const improvementsGrammarAdded: any[] = [];
//   const improvementsTextAdded: any[] = [];

//   const seenSentences: Record<string, number> = {};

//   // Loop through key, val of pplPerSentence
//   for (let i = 0; i < pplPerSentence.length; i++) {
//     const sentence = pplPerSentence[i]["sentence"];
//     const perplexity = pplPerSentence[i]["perplexity"];

//     if (perplexity <= RED_PERPLEXITY_MAX) {
//       const highlightColor =
//         perplexity <= RED_PERPLEXITY_MAX
//           ? `${AIHighlightColor};`
//           : `${grammarHighlightColor};`;

//       // see if sentence is in seen sentences
//       if (seenSentences[sentence]) {
//         seenSentences[sentence]++;
//         newHTML = replace_nth(
//           newHTML,
//           sentence,
//           `<mark style="background: ${highlightColor}">${sentence}</mark>`,
//           seenSentences[sentence],
//         );
//       } else {
//         seenSentences[sentence] = 1;
//         newHTML = newHTML.replace(
//           `${sentence}`,
//           `<mark style="background: ${highlightColor}">${sentence}</mark>`,
//         );
//       }
//     }
//   }

//   // Old logic of adding grammar and text improvements highlights
//   // if (improvementsGrammar) {
//   //   for (let i = 0; i < improvementsGrammar.length; i++) {
//   //     const text = improvementsGrammar[i]["originalText"];

//   //     // see if text is in html
//   //     if (!newHTML.includes(text)) {
//   //       console.log("SKIPPING HERE?");

//   //       continue;
//   //     }

//   //     // Add yellow grammar highlight to sentence
//   //     try {
//   //       const highlightColor =
//   //         grammarHighlightColor === "rgb(208, 182, 94)"
//   //           ? grammarHighlightColor
//   //           : "rgb(208, 182, 94)`";

//   //       newHTML = replaceWholeWordOnly(
//   //         newHTML,
//   //         `${text}`,
//   //         `<mark style="background: ${highlightColor}">${text}</mark>`,
//   //       );

//   //       improvementsGrammarAdded.push(improvementsGrammar[i]);
//   //     } catch (e) {
//   //       console.error("Error replacing whole word only: ", text);
//   //       continue;
//   //     }
//   //   }
//   // }
//   // if (improvementsText) {
//   //   for (let i = 0; i < improvementsText.length; i++) {
//   //     const text = improvementsText[i]["originalText"];

//   //     // see if text is in html
//   //     if (!newHTML.includes(text)) {
//   //       continue;
//   //     }

//   //     try {
//   //       // Add blue improvement highlight to sentence
//   //       newHTML = replaceWholeWordOnly(
//   //         newHTML,
//   //         `${text}`,
//   //         `<mark style="background: rgb(121, 184, 216)">${text}</mark>`,
//   //       );
//   //       improvementsTextAdded.push(improvementsText[i]);
//   //     } catch (e) {
//   //       console.error("Error replacing whole word only: ", text);
//   //       continue;
//   //     }
//   //   }
//   // }

//   // repeat double ending </mark> tag with one </mark>
//   newHTML = newHTML.replace(/<\/mark><\/mark>/g, "</mark>");

//   newHTML = newHTML.replace(
//     /<mark style="background: rgb\(208, 97, 94\);"><mark style="background: rgb\(255, 171, 171\);">/g,
//     `<mark style="background: ${RED_HIGHLIGHT};">`,
//   );

//   return { newHTML, improvementsGrammarAdded, improvementsTextAdded };
// };

// // the # of free checker usages to limit to per day
// export const MAX_FREE_CHECKER_USAGES_PER_DAY = 7;

// /**
//  * For free users, check if checker usages have exceeded a certain amount
//  * @param isUserPro - will return true immediately
//  * @returns true if within limits, false otherwise
//  */
// export const hasCheckerUsagesLeft = (isUserPro: boolean) => {
//   if (isUserPro) return true;

//   const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
//   const checkerUsagesToday = parseInt(
//     localStorage.getItem(LOCAL_STORAGE_KEY.CHECKER_USAGES_TODAY) || "0",
//     10,
//   );
//   const checkerUsedDate = localStorage.getItem(
//     LOCAL_STORAGE_KEY.CHECKER_USED_DATE,
//   );

//   // Check if the stored date is different from today's date
//   if (checkerUsedDate !== today) {
//     // Reset both CHECKER_USAGES_TODAY and CHECKER_USED_DATE
//     localStorage.setItem(LOCAL_STORAGE_KEY.CHECKER_USAGES_TODAY, "1");
//     localStorage.setItem(LOCAL_STORAGE_KEY.CHECKER_USED_DATE, today);
//     return true; // Allow usage as the count is reset
//   } else if (checkerUsagesToday >= 5) {
//     // If usages exceed 5, return false
//     return false;
//   } else {
//     // Increment checker usages for today
//     localStorage.setItem(
//       LOCAL_STORAGE_KEY.CHECKER_USAGES_TODAY,
//       (checkerUsagesToday + 1).toString(),
//     );
//     return true;
//   }
// };
