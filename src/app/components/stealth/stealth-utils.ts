// import {
//   getLocally,
//   LOCAL_STORAGE_KEY,
//   storeLocally,
// } from "@/helpers/browser/local-storage";
// import { convertHTMLToNormalText } from "@/helpers/write/editor-content";
// import { Analytics } from "@/lib/analytics";
// import { UserMetrics } from "@/lib/user-metrics";
// import { authContextType } from "@/store/context/AuthContext";
// import useAppsTour from "@/store/layout/useAppsTour";
// import useEnhanceSettings from "@/store/settings/useEnhanceSettings";
// import { useStealth } from "@/store/stealth/useStealth";
// import { Editor } from "@tiptap/react";
// import { makePostRequest } from "helpers/browser/requests";
// import {
//   chargeUserUtil,
//   checkIfEnoughTokensOrCredits,
//   CREDIT_DISTRIBUTION,
//   getStealthCreditsFromText,
//   openUpgradeModal,
// } from "helpers/pricing/pricing";
// import {
//   AI_WRITTEN_MESSAGE,
//   GRAMMAR_IMPROVEMENT_SCORE_PENALTY,
//   HUMAN_WRITTEN_MESSAGE,
//   MAX_WORDS,
//   MAX_WORDS_CHECKING,
//   MIN_WORDS,
//   MOSTLY_HUMAN_MESSAGE,
//   RED_HIGHLIGHT_HEX,
//   RED_PERPLEXITY_MAX,
//   RED_SCORE_MAX,
//   SECOND_BACKEND_URL,
//   SIGNUP_PATH,
//   SITE_VERSION,
//   YELLOW_HIGHLIGHT_HEX,
//   YELLOW_SCORE_MAX,
// } from "helpers/shared/constants";
// import { getTextWordCount, isSpacedLanguage } from "helpers/shared/strings";
// import {
//   calculateScoreFromPPL,
//   generateHighlightsFromText,
//   scoreAfterGrammarAndTextImprovements,
//   sendCheckDocumentRequestToBackend,
// } from "helpers/stealth/checker-helper";
// import {
//   removeGrammarHighlightInHTML,
//   rewriteAllSentencesMethod1ByParagraph,
//   rewriteParagraphInHTML,
//   rewriteSingleSentenceInHTML,
//   rewriteTextToFixGrammarInHTML,
// } from "helpers/stealth/rewriter-helper";
// import { NextRouter } from "next/router";
// import React from "react";
// import { buildStyles } from "react-circular-progressbar";
// import toast from "react-hot-toast";
// import {
//   FREE_STYLES,
//   STEALTH_AI_HIGHLIGHT_COLOR,
//   STEALTH_GRAMMER_HIGHLIGHT_COLOR,
// } from "./data";
// import {
//   applyTitlesWithFormatting,
//   checkIfIframeVersion,
//   handleActionTaken,
//   hasCheckerUsagesLeft,
//   newCheckForBibliography,
//   saveTitlesWithFormatting,
// } from "./general-utils";

// export const getScoreProgressBarStyle = (score: number) => {
//   if (score < RED_SCORE_MAX) {
//     return buildStyles({
//       textSize: "40px",
//       textColor: RED_HIGHLIGHT_HEX,
//       pathColor: RED_HIGHLIGHT_HEX,
//       backgroundColor: RED_HIGHLIGHT_HEX + "26",
//       trailColor: "none",
//     });
//   } else if (score < YELLOW_SCORE_MAX) {
//     return buildStyles({
//       textSize: "40px",
//       textColor: YELLOW_HIGHLIGHT_HEX,
//       pathColor: YELLOW_HIGHLIGHT_HEX,
//       backgroundColor: YELLOW_HIGHLIGHT_HEX + "26",
//       trailColor: "none",
//     });
//   } else {
//     return buildStyles({
//       textSize: "40px",
//       textColor: "#5ED09A",
//       pathColor: "#5ED09A",
//       backgroundColor: "#5ED09A26",
//       trailColor: "none",
//     });
//   }
// };

// export const generateMessageFromScore = (score: number) => {
//   if (score <= RED_SCORE_MAX) {
//     return AI_WRITTEN_MESSAGE;
//   } else if (score <= YELLOW_SCORE_MAX) {
//     return MOSTLY_HUMAN_MESSAGE;
//   } else {
//     return HUMAN_WRITTEN_MESSAGE;
//   }
// };

// export const ensureWordCount = (
//   text = "",
//   checkingEssay = false,
//   language = "english",
// ) => {
//   let wordCountToUse = text.split(" ").length;

//   // if checkingEssay, use different max words
//   const maxWordsToUse = checkingEssay ? MAX_WORDS_CHECKING : MAX_WORDS;

//   const currDocLanguage = language;

//   // if presetText, use that instead for word count
//   if (text.length > 0) {
//     wordCountToUse = getTextWordCount(text, currDocLanguage);
//   } else if (!isSpacedLanguage(currDocLanguage)) {
//     // if not using preset text and indeed using current text but lang not english, calc differently
//     wordCountToUse = getTextWordCount(text, currDocLanguage);
//   }

//   // ensure min words
//   if (wordCountToUse < MIN_WORDS) {
//     // remove previous toasts
//     toast.remove();

//     toast.error(
//       `Please enter at least ${MIN_WORDS} words in order for the algorithm to be effective.`,
//       {
//         duration: 7500,
//       },
//     );
//     return false;
//   }

//   // check if exceeded max words
//   if (wordCountToUse > maxWordsToUse) {
//     // remove previous toasts
//     toast.remove();

//     toast.error(
//       `Essay checks are limited to ${MAX_WORDS_CHECKING} and rewrites are limited to ${MAX_WORDS} words. For greater word limits, please email partnerships@getconch.ai`,
//       {
//         duration: 7500,
//       },
//     );
//     return false;
//   }

//   return true;
// };

// export const filterPplPerSentence = (pplPerSentence: any[]) => {
//   // if 'sentence' is less than 10 characters, remove it
//   const filteredPplPerSentence = pplPerSentence.filter((ppl) => {
//     if (ppl["sentence"].length < 10) {
//       return false;
//     }

//     // if it contains https://www or http://www, remove it
//     if (
//       ppl["sentence"].includes("https://") ||
//       ppl["sentence"].includes("http://")
//     ) {
//       return false;
//     }

//     return true;
//   });

//   return filteredPplPerSentence;
// };

// export const checkEssayForNewStealth = async (
//   text: string,
//   mongoDBUser: any,
//   recheck: boolean = false,
//   isUserPro: boolean = false,
//   router: NextRouter,
//   editor: Editor | null = null,
// ) => {
//   const isIframeVersion = checkIfIframeVersion();
//   const isUserLimitless = mongoDBUser?.currPlan
//     ?.toLowerCase()
//     .includes("limitless");
//   if (
//     !isUserPro &&
//     !isUserLimitless &&
//     !FREE_STYLES.includes(useEnhanceSettings.getState().style)
//   ) {
//     toast.error("Please upgrade to use this style", {
//       position: "top-center",
//       duration: 5000,
//     });
//     return;
//   }

//   UserMetrics.updateUserMetricsOnAnalyticsEvent("lastUsedEnhance");
//   // try to use editor.getText() (passed as param), if not then use HTML
//   let editorText =
//     text || convertHTMLToNormalText(useStealth.getState().editorText.trim());

//   // if text not present, return

//   if (!editorText) {
//     toast.dismiss();
//     toast.error("Please write some text.", {
//       position: "top-center",
//       duration: 5000,
//     });
//     return;
//   }

//   // If want to consider references, uncomment this
//   // let { references, textWithoutReferences } =
//   //   separateReferencesAndText(editorText);
//   // editorText = textWithoutReferences;

//   if (!hasCheckerUsagesLeft(isUserPro, editorText)) {
//     handleActionTaken(isIframeVersion, router, editor);
//     return;
//   }

//   // set just rewritten to false
//   useStealth.setState({ justRewritten: false });

//   try {
//     if (!ensureWordCount(editorText, true)) return;
//     const isIframeVersion = checkIfIframeVersion();

//     // if checking from app, (not landing page) then check for credits before allowing to check
//     if (
//       !isIframeVersion &&
//       !checkIfEnoughTokensOrCredits(
//         mongoDBUser,
//         0,
//         getStealthCreditsFromText(editorText),
//         "stealth",
//       )
//     )
//       return;

//     // update stealth mode and enable loading
//     useStealth.setState({
//       stealthMode: "check",
//       isLoading: true,
//     });

//     // prepare req body for backend
//     const data = {
//       text: editorText,
//       academicLevel: "",
//     };

//     // post request to check per line
//     sendCheckDocumentRequestToBackend(data)
//       .then(async (res) => {
//         // --- INFO: All the commented lines were not used in previous editor
//         console.log(res.data);
//         const pplPerSentence = filterPplPerSentence(res.data.pplPerSentence);
//         // const burstiness = res.data.results.burstiness;
//         const pplByClumps = res.data.pplByClumps;
//         const percentageAI = res.data?.percentageAI ?? -1;

//         // average perplexity by sentence
//         let perplexityPerSentenceScore = res.data.results.perplexityPerSentence;

//         // round perplexityPerSentenceScore to integer
//         perplexityPerSentenceScore =
//           Math.round(perplexityPerSentenceScore * 100) / 100;

//         // const percentAI = getPercentageOfTextAI(pplPerSentence);

//         // only check for grammar if AI is less than 75%
//         // if (percentAI < 75) {
//         //   const improvements = await getAndSetImprovements(pplPerSentence);
//         //   finalGrammarImprovements = improvements.finalGrammarImprovements;
//         //   finalTextImprovements = improvements.finalTextImprovements;
//         // } else {
//         // TODO: disable grammar and text for now

//         //  }

//         // Generate highlighted text using helper function
//         let { newHTML, improvementsGrammarAdded, improvementsTextAdded } =
//           generateHighlightsFromText(
//             useStealth.getState().editorText, // passing HTML to preserve formatting
//             pplPerSentence,
//             useStealth.getState().grammerImprovements,
//             useStealth.getState().textImprovements,
//             STEALTH_AI_HIGHLIGHT_COLOR,
//             STEALTH_GRAMMER_HIGHLIGHT_COLOR,
//           );

//         // attaching references to newHTML
//         let modifiedHTML = newHTML;

//         // Set only the improvements that were highlighted
//         // The ones that were not highlighted, do not show a card for that

//         // Was disabled in old editor as well
//         // useStealth.setState({
//         //   grammerImprovements: improvementsGrammarAdded,
//         //   textImprovements: improvementsTextAdded,
//         // });

//         // calculate score
//         let score =
//           percentageAI > 0
//             ? Math.floor(100 - percentageAI)
//             : calculateScoreFromPPL(pplPerSentence);

//         // apply score from grammar and text improvements
//         score = scoreAfterGrammarAndTextImprovements(
//           score,
//           improvementsGrammarAdded,
//           improvementsTextAdded,
//         );

//         // Generate message based on score
//         // const outputMessage = generateOutputMessage(
//         //   score,
//         //   pplPerSentence,
//         //   improvementsGrammarAdded,
//         //   improvementsTextAdded,
//         // );

//         Analytics.incrementUserProperty("enhance_essays_checked");

//         Analytics.track(
//           "Enhance: " + recheck ? "Recheck for AI" : "Check for AI",
//           {
//             mongoDBUser,
//             "ai detection score": score,
//             "ai problems": useStealth.getState().rewriteObjects?.length,
//             "grammar problems":
//               useStealth.getState().grammerImprovements.length,
//             "style problems": useStealth.getState().textImprovements.length,
//             "tokens to rewrite all": getTokensToRewrite(),
//             problems: res.data,
//             "response generated": true,
//             "current tokens left": mongoDBUser.currTokensLeft,
//             "word count": editorText?.split(" ").length,
//             "sufficient tokens available": mongoDBUser?.currPlan
//               ? true
//               : mongoDBUser?.currTokensLeft >= getTokensToRewrite(),
//           },
//         );

//         // Disabling this check as wasn't enabled before redesign
//         // const storedHumanizedEssays = JSON.parse(
//         //   localStorage.getItem(LOCAL_STORAGE_KEY.STEALTH_HUMANIZED_ESSAYS) ||
//         //     "[]",
//         // );

//         // const isEssayAlreadyHumanized =
//         //   storedHumanizedEssays?.some(
//         //     (humanizedEssay: any) => humanizedEssay.text === text,
//         //   ) || false;

//         useStealth.setState({
//           rewriteRefs: createRewriteRefs(pplPerSentence),
//           editorText: modifiedHTML as string,
//           checkedForAI: true,
//           isLoading: false,
//           score,
//           stealthMode: "",
//           rewriteObjects: pplByClumps
//             ? generateRewriteObjects(pplByClumps)
//             : [],
//           pplPerSentence,
//           grammerImprovements: improvementsGrammarAdded,
//         });

//         if (!getLocally(LOCAL_STORAGE_KEY.TRIED_STEALTH_CHECK)) {
//           storeLocally(LOCAL_STORAGE_KEY.TRIED_STEALTH_CHECK, "true");
//           useAppsTour.setState({ refreshStatus: true });
//         }
//       })
//       .catch((err) => {
//         console.log(":::::", err);
//         useStealth.setState({
//           ...useStealth.getState(),
//           stealthMode: "",
//           isLoading: false,
//         });
//       })
//       .finally(() => {});
//   } catch (err) {
//     console.log(err);
//     useStealth.setState({
//       ...useStealth.getState(),
//       stealthMode: "",
//       isLoading: false,
//     });
//   }
// };

// export const generateRewriteObjects = (clumps: any) => {
//   let rewriteObjects = [];

//   let id = 0;

//   // loop through clumps
//   for (let i = 0; i < clumps.length; i++) {
//     const clump = clumps[i];

//     let numbLowPerplexitySentences = 0;

//     let lastLowPerpelxitySentence;

//     let textSoFar = "";

//     // loop through sentences in clump
//     for (let j = 0; j < clump.length; j++) {
//       const sentence = clump[j];
//       const ppl = sentence["perplexity"];

//       textSoFar += sentence["sentence"] + " ";

//       if (ppl < RED_PERPLEXITY_MAX) {
//         lastLowPerpelxitySentence = sentence;
//         numbLowPerplexitySentences++;

//         rewriteObjects.push({
//           sentence: lastLowPerpelxitySentence,
//           type: "sentence",
//           text: textSoFar,
//           id,
//         });

//         id += 1;
//       }
//     }

//     // remove last space
//     textSoFar = textSoFar.trim();

//     // > 1 = rewrite paragraph
//     if (numbLowPerplexitySentences > 1) {
//       rewriteObjects.push({
//         clump: clump,
//         type: "paragraph",
//         text: textSoFar,
//         id,
//       });

//       id += 1;
//     }
//   }

//   return rewriteObjects;
// };

// export const getTokensToRewrite = (language?: string) => {
//   let wordCount = useStealth.getState().editorText.split(" ").length;
//   if (wordCount > 0) {
//     const currDocLanguage = language ?? "english";

//     let localizedWordCount = wordCount;
//     let tokensToRewriteAll = Math.ceil(wordCount * 1.25);

//     if (!isSpacedLanguage(currDocLanguage)) {
//       localizedWordCount = getTextWordCount(
//         useStealth.getState().editorText,
//         currDocLanguage,
//       );
//       tokensToRewriteAll = Math.floor(localizedWordCount * 0.5);
//     }

//     // set state vars
//     // setLocalizedWordCount(localizedWordCount);
//     return tokensToRewriteAll;
//   }

//   return 0;
// };

// // to create HTML refs for each rewrite
// export const createRewriteRefs = (pplPerSentence: any) => {
//   const newRewriteRefs: any = [];

//   pplPerSentence.forEach(() => {
//     newRewriteRefs.push(React.createRef());
//   });
//   return newRewriteRefs;
// };

// export const rewriteSingleSentence = async (
//   line: any,
//   perplexity: any,
//   id: any,
//   tokensToCharge: any,
//   mongoDBUser: any,
//   updateUserOnFrontend: Function,
// ) => {
//   try {
//     const editorText = useStealth.getState().editorText;

//     if (
//       !checkIfEnoughTokensOrCredits(
//         mongoDBUser,
//         tokensToCharge,
//         getStealthCreditsFromText(editorText),
//         "stealth",
//       )
//     ) {
//       useStealth.setState({ stealthMode: "", isLoading: false });
//       return;
//     }

//     if (true) {
//       toast.error(
//         "This sentence is too AI to be rewritten, please use humanize all to fix this and other sentences",
//         {
//           duration: 9000,
//         },
//       );
//       return;
//     }

//     useStealth.setState({ currentlyRewritingCardId: id });

//     Analytics.track("Enhance: Click Rewrite Individual", {
//       "rewrite type": "sentence",
//     });

//     // If can't find text in editor, show toast to make them recheck
//     if (!editorText.includes(line)) {
//       toast.error("Initial text was changed, please press recheck.", {
//         position: "bottom-center",
//         duration: 5000,
//       });
//       return;
//     }

//     useStealth.setState({ isRewriting: true });

//     // Show toast that individual sentence rewrite is not effective
//     showIndividualRewriteTipOnce();

//     let { newHTML, rewrittenSentence } = await rewriteSingleSentenceInHTML(
//       useStealth.getState().editorText,
//       line,
//       perplexity,
//     );

//     useStealth.setState({
//       isRewriting: false,
//       currentlyRewritingCardId: -1,
//     });

//     // if line still exists, show a toast error
//     if (newHTML.includes(line)) {
//       toast.error(
//         "This sentence is too AI to be rewritten, please use humanize all to fix this and other sentences",
//         {
//           duration: 9000,
//         },
//       );
//       return;
//     }

//     chargeUserUtil(
//       mongoDBUser,
//       tokensToCharge,
//       CREDIT_DISTRIBUTION.STEALTH_REWRITE_CREDIT,
//     );
//     useStealth.setState({
//       editorText: newHTML,

//       justRewritten: true,
//     });

//     // update this entry in rewrite objects
//     removeRewriteObject(id, mongoDBUser);

//     return rewrittenSentence;
//   } catch (err) {
//     console.error(err);
//     useStealth.setState({
//       isRewriting: false,
//       currentlyRewritingCardId: -1,
//     });
//   }
// };

// export const showIndividualRewriteTipOnce = () => {
//   if (!localStorage.getItem("individualRewriteTip")) {
//     toast(
//       "WARNING: individual rewriting is not very effective and has a high likely-hood of being detected by GPTZero and TurnItIn. Use Humanize All for the best results and then use individual rewriting for any remaining items.",
//       { duration: 12000, icon: "🚨" },
//     );
//     localStorage.setItem("individualRewriteTip", "true");
//   }
// };

// export const removeRewriteObject = (id: any, mongoDBUser: any) => {
//   let toRemoveRewriteObject;

//   // find the rewriteObject in rewriteObjects and remove it
//   const newRewriteObjects = useStealth
//     .getState()
//     .rewriteObjects.filter((rewriteObject: any) => {
//       if (parseInt(rewriteObject.id) === parseInt(id)) {
//         // this is the object to remove
//         toRemoveRewriteObject = rewriteObject;
//         // remove this by not returning true
//         if (rewriteObject?.type === "paragraph") {
//           var allSentences: any[] = [];
//           var allPerplexities: any[] = [];
//           var totalCost = 0;

//           rewriteObject?.clump.map((obj: any) => {
//             allSentences.push(obj?.sentence);
//             allPerplexities.push(obj?.perplexity);
//             totalCost += Math.ceil(obj?.sentence.length / 4) || 0;
//           });

//           Analytics.track("delete_problem", {
//             mongoDBUser,
//             problemType: "AI",
//             id: rewriteObject.id,
//             cost: totalCost,
//             perplexity: allPerplexities,
//             phrase: allSentences,
//           });
//         } else if (rewriteObject?.type === "sentence") {
//           const tokenCost =
//             Math.ceil(rewriteObject?.sentence?.sentence.length / 4) || 0;
//           Analytics.track("delete_problem", {
//             mongoDBUser,
//             problemType: "AI",
//             id: rewriteObject.id,
//             cost: tokenCost,
//             perplexity: rewriteObject?.sentence.perplexity,
//             phrase: rewriteObject?.sentence?.sentence,
//           });
//         }
//         // TODO - Unsure: Remove the highlighting of the sentence as the correction card is being removed
//       } else {
//         return true;
//       }
//     });

//   // add to removed rewrite objects this new object (commenting because not used)
//   //   setRemovedRewriteObjects([...removedRewriteObjects, toRemoveRewriteObject]);

//   useStealth.setState({ rewriteObjects: newRewriteObjects });
// };

// export const rewriteParagraph = async (
//   text: string,
//   perplexity: number,
//   id: number,
//   tokensToCharge: number,
//   mongoDBUser: any,
//   updateUserOnFrontend: Function,
// ) => {
//   const editorText = useStealth.getState().editorText;

//   if (
//     !checkIfEnoughTokensOrCredits(
//       mongoDBUser,
//       tokensToCharge,
//       getStealthCreditsFromText(editorText),
//       "stealth",
//     )
//   ) {
//     useStealth.setState({ stealthMode: "", isLoading: false });
//     return;
//   }

//   Analytics.track("Enhance: Click Rewrite Individual", {
//     "rewrite type": "paragraph",
//   });

//   // If can't find text in editor, show toast to make them recheck
//   if (!editorText.includes(text)) {
//     toast.error("Initial text was changed, please press recheck.", {
//       position: "bottom-center",
//       duration: 5000,
//     });
//     return "";
//   }

//   useStealth.setState({ isRewriting: true, currentlyRewritingCardId: id });

//   // Show toast that individual sentence rewrite is not effective
//   showIndividualRewriteTipOnce();

//   let { newHTML, rewrittenText } = await rewriteParagraphInHTML(
//     editorText,
//     text,
//   );
//   chargeUserUtil(
//     mongoDBUser,
//     tokensToCharge,
//     CREDIT_DISTRIBUTION.STEALTH_REWRITE_CREDIT,
//   );

//   useStealth.setState({
//     editorText: newHTML,
//     justRewritten: true,
//   });

//   // update this entry in rewrite objects
//   removeRewriteObject(id, mongoDBUser);

//   return rewrittenText;
// };

// export const humanizeButtonClick = async (
//   textToBeHumanized: string,
//   rehumanizeFeedback = "",
//   authContext: authContextType,
//   updateUserOnFrontend: Function,
// ) => {
//   let { mongoDBUser, updateUser, isLoggedIn, isUserPro, isUserLimitless } =
//     authContext;

//   if (!isLoggedIn) {
//     Analytics.track("Redirect To Sign Up", {
//       from: "Enhance: Click Humanize",
//       location: "Enhance: Click Humanize",
//     });
//     return (window.location.href = SIGNUP_PATH);
//   }

//   if (
//     !isUserPro &&
//     !isUserLimitless &&
//     !FREE_STYLES.includes(useEnhanceSettings.getState().style)
//   ) {
//     toast.error("Please upgrade to use this style", {
//       position: "top-center",
//       duration: 5000,
//     });
//     return;
//   }

//   let editorText =
//     textToBeHumanized ||
//     convertHTMLToNormalText(useStealth.getState().editorText);

//   if (!editorText) {
//     toast.dismiss();
//     toast.error("Please write some text.", {
//       position: "top-center",
//       duration: 5000,
//     });
//     return;
//   }

//   if (!ensureWordCount(editorText)) return;

//   let wordCount = editorText.split(" ").length;

//   useStealth.setState({
//     isLoading: true,
//     stealthMode: "humanize",
//   });

//   const { returnedText } = newCheckForBibliography(editorText);

//   let text = returnedText;

//   // if humanizing based on feedback, use the text there before
//   if (rehumanizeFeedback && useStealth.getState().textBeforeHumanizingAll) {
//     text = useStealth.getState().textBeforeHumanizingAll;
//   }

//   let tokensNeeded = getTokensToRewrite();

//   // if tokensNeeded is super high, cap it at MAX_WORDS + 500
//   if (tokensNeeded > MAX_WORDS + 500) {
//     tokensNeeded = MAX_WORDS + 500;
//   }

//   if (
//     !checkIfEnoughTokensOrCredits(
//       mongoDBUser,
//       tokensNeeded,
//       getStealthCreditsFromText(editorText),
//       "stealth",
//     )
//   ) {
//     useStealth.setState({ stealthMode: "", isLoading: false });
//     return;
//   }

//   if (wordCount < 150) {
//     toast.error(
//       "Please note: Conch works best with documents over 150 words. Otherwise, the results may be inconsistent both for Conch and the AI detectors.",
//       { duration: 10000, icon: "⚠️" },
//     );
//   }

//   useStealth.setState({
//     textBeforeHumanizingAll: useStealth.getState().editorText,
//   });

//   let boldTitles = null;

//   // save titles with formatting from editorHTML();
//   try {
//     boldTitles = saveTitlesWithFormatting(useStealth.getState().editorText);
//   } catch (err) {
//     console.error(err);
//   }

//   let rewrittenHTML = "";

//   const bypassFocus =
//     useEnhanceSettings.getState().aiDetector?.toLocaleLowerCase() ?? "gptzero";

//   let currentHumanizedCount =
//     bypassFocus != useStealth.getState().lastHumanizedBypassMethod
//       ? 0
//       : useStealth.getState().humanizedCount;

//   //TOOD: add more rewrite techniques
//   // Keep academic level and readablity as "high school"
//   if (true) {
//     rewrittenHTML = (await rewriteAllSentencesMethod1ByParagraph(
//       text,
//       useStealth.getState().pplPerSentence,
//       "high school",
//       bypassFocus,
//       "method1",
//       {
//         ...{},
//         humanizedCount: currentHumanizedCount,
//       },
//       rehumanizeFeedback,
//     )) as string;

//     // to track if next time there was a switch
//     useStealth.setState({ lastHumanizedBypassMethod: bypassFocus });

//     // returned error not enough tokens
//     if (typeof rewrittenHTML === "boolean" && rewrittenHTML) {
//       useStealth.setState({ isLoading: false, stealthMode: "" });
//       openUpgradeModal();
//       return;
//     }
//   }

//   // apply back titles with formatting from editorHTML();
//   let updatedHTML = rewrittenHTML;

//   // apply bold titles formatting
//   try {
//     if (boldTitles && boldTitles.length) {
//       updatedHTML = applyTitlesWithFormatting(rewrittenHTML, boldTitles);
//     }
//   } catch (err) {
//     console.error(err);
//   }

//   Analytics.incrementUserProperty("humanize_clicked");

//   Analytics.track("Enhance: Click Humanize", {
//     mongoDBUser,
//     "total problems":
//       useStealth.getState().rewriteObjects.length +
//       useStealth.getState().grammerImprovements.length +
//       useStealth.getState().textImprovements.length,
//     "word count": text?.split(" ").length,
//     "tokens to rewrite all": tokensNeeded,
//     "sufficient tokens available": true,
//     problems: {
//       rewriteObjects: useStealth.getState().rewriteObjects.length,
//       improvementsGrammar: useStealth.getState().grammerImprovements,
//       improvementsText: useStealth.getState().textImprovements,
//     },
//     "response generated": true,
//     "generated response": rewrittenHTML,
//   });

//   // only if not rehumanizing with feedback, otherwise the rehumanize is free
//   // if (!rehumanizeFeedback) {
//   //   chargeUserUtil(
//   //     authContext,
//   //     tokensNeeded,
//   //     CREDIT_DISTRIBUTION.STEALTH_REWRITE_CREDIT,
//   //   );
//   // }

//   updateUser();

//   // increment locally and saveOrCreate will also increment it using the documents array document
//   useStealth.setState({
//     humanizedCount: useStealth.getState().humanizedCount + 1,
//     stealthMode: "",
//     editorText: updatedHTML,
//     justRewritten: true,
//     showFeedback: true,
//     isLoading: false,
//   });

//   if (!getLocally(LOCAL_STORAGE_KEY.TRIED_STEALTH_HUMANIZE)) {
//     storeLocally(LOCAL_STORAGE_KEY.TRIED_STEALTH_HUMANIZE, "true");
//     useAppsTour.setState({ refreshStatus: true });
//   }
// };

// export const onFeedbackSelect = async (feedback: "good" | "bad") => {
//   try {
//     const data = {
//       goodResult: feedback === "good",
//       badResult: feedback === "bad",
//       originalText: useStealth.getState().textBeforeHumanizingAll,
//       newEditorText: useStealth.getState().editorText,
//       aiDetector: useEnhanceSettings.getState().aiDetector,
//       feedbackText: "",
//       siteVersion: SITE_VERSION,
//     };

//     await makePostRequest(
//       `${SECOND_BACKEND_URL}/ai/bypasser/store-feedback`,
//       data,
//     );
//   } catch (err) {
//     console.log(err);
//     console.log(err);
//     toast.error("Failed to submit feedback. Please try again later.", {
//       duration: 5000,
//     });
//   }
// };

// export const openTokenPaywallModal = (authContext: authContextType) => {};

// export const fixGrammarCard = (
//   correction: any,
//   mongoDBUser: any,
//   authContext: authContextType,
//   updateUserOnFrontend: Function,
// ) => {
//   const editorText = useStealth.getState().editorText;

//   if (
//     !checkIfEnoughTokensOrCredits(
//       mongoDBUser,
//       0,
//       getStealthCreditsFromText(editorText),
//       "stealth",
//     )
//   ) {
//     useStealth.setState({ stealthMode: "", isLoading: false });
//     return;
//   }

//   const { originalText, suggestion } = correction;

//   // If can't find text in editor, show toast to make them recheck
//   if (!editorText.includes(originalText)) {
//     toast.error("Initial text was changed, please press recheck.", {
//       position: "bottom-center",
//       duration: 5000,
//     });
//     return;
//   }

//   let newHTML = rewriteTextToFixGrammarInHTML(
//     editorText,
//     originalText,
//     suggestion,
//   );

//   chargeUserUtil(mongoDBUser, 20, CREDIT_DISTRIBUTION.DOC_ACTION_CREDIT);
//   useStealth.setState({ editorText: newHTML });

//   let score = useStealth.getState().score;
//   // increase the score for fixing a grammar improvement
//   useStealth.setState({
//     score:
//       score + GRAMMAR_IMPROVEMENT_SCORE_PENALTY > 100
//         ? 100
//         : score + GRAMMAR_IMPROVEMENT_SCORE_PENALTY,
//   });

//   // remove card
//   deleteGrammarCard(correction, false, mongoDBUser);
// };

// export const deleteGrammarCard = (
//   correction: any,
//   removeHighlight: any,
//   mongoDBUser: any,
// ) => {
//   // remove card from improvementsGrammar array using correction id
//   let improvementsGrammar = useStealth.getState().grammerImprovements;
//   const newImprovementsGrammar = improvementsGrammar.filter(
//     (correctionObj: any) => {
//       if (correctionObj.id === correction.id) {
//         console.log("correctionObj", correctionObj);

//         Analytics.track("delete_problem", {
//           mongoDBUser,
//           problemType: "Grammar",
//           cost: 50,
//           phrase: correctionObj?.originalText,
//           id: correction.id,
//         });
//         return false;
//       } else {
//         return true;
//       }
//     },
//   );

//   // if also removing highlight, remove highlight and set new HTML
//   if (removeHighlight) {
//     let newHTML = removeGrammarHighlightInHTML(
//       useStealth.getState().editorText,
//       correction.originalText,
//     );
//     useStealth.setState({
//       editorText: newHTML,
//     });
//   }

//   let score = useStealth.getState().score;

//   // increase the score for fixing a grammar improvement
//   useStealth.setState({
//     score:
//       score + GRAMMAR_IMPROVEMENT_SCORE_PENALTY > 100
//         ? 100
//         : score + GRAMMAR_IMPROVEMENT_SCORE_PENALTY,
//   });

//   useStealth.setState({ grammerImprovements: newImprovementsGrammar });
// };
