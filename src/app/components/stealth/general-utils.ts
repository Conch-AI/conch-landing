// import { Analytics } from "@/lib/analytics";
// import { Editor } from "@tiptap/react";
// import saveAs from "file-saver";
// import { LOCAL_STORAGE_KEY } from "helpers/browser/local-storage";
// import { getFileType } from "helpers/parser/file-parser";
// import { URL_AFTER_AUTH } from "helpers/shared/constants";
// import {
//   convertToDoc,
//   convertToDocx,
//   convertToPPT,
//   convertToPPTX,
//   parsePdfFile,
// } from "helpers/write/personalization-utils";
// import parse from "html-react-parser";
// import jsPDF from "jspdf";
// import { NextRouter } from "next/router";
// import {
//   defaultMarks,
//   defaultNodes,
//   DocxSerializer,
//   writeDocx,
// } from "prosemirror-docx";
// import toast from "react-hot-toast";
// import { useStealth } from "../../store/stealth/useStealth";
// import { newStealthPresetSamples } from "./data";

// export const checkIfIframeVersion = (): boolean => {
//   return (
//     window.self !== window.top ||
//     window.location.pathname === "/iframes/stealth-checker"
//   );
// };
// export const handleActionTaken = (
//   isIframeVersion: boolean,
//   router: NextRouter,
//   editor: Editor | null,
// ) => {
//   if (isIframeVersion) {
//     // on iframe version redirect to app
//     if (window.top) {
//       window.top.location.href = "https://www.app.getconch.ai/app";
//     }
//     if (editor) {
//       editor?.commands?.clearContent();
//     }
//   } else {
//     router.push(URL_AFTER_AUTH);
//   }
// };

// export const hasCheckerUsagesLeft = (isUserPro: boolean, text: string) => {
//   if (isUserPro) return true;

//   const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
//   const checkerUsagesToday = parseInt(
//     localStorage.getItem(LOCAL_STORAGE_KEY.CHECKER_USAGES_TODAY) || "0",
//     10,
//   );
//   const checkerUsedDate = localStorage.getItem(
//     LOCAL_STORAGE_KEY.CHECKER_USED_DATE,
//   );

//   // Check if using custom text
//   if (Object.values(newStealthPresetSamples).includes(text)) {
//     // Check if the stored date is different from today's date
//     if (checkerUsedDate !== today) {
//       // Reset both CHECKER_USAGES_TODAY and CHECKER_USED_DATE
//       localStorage.setItem(LOCAL_STORAGE_KEY.CHECKER_USAGES_TODAY, "1");
//       localStorage.setItem(LOCAL_STORAGE_KEY.CHECKER_USED_DATE, today);
//       return true; // Allow usage as the count is reset
//     } else if (checkerUsagesToday >= 5) {
//       // If usages exceed 5, return false
//       return false;
//     } else {
//       // Increment checker usages for today
//       localStorage.setItem(
//         LOCAL_STORAGE_KEY.CHECKER_USAGES_TODAY,
//         (checkerUsagesToday + 1).toString(),
//       );
//       return true;
//     }
//   } else {
//     return true; // give unlimited chances if using preset text
//   }
// };

// export const checkIfBoldItalicOrUnderline = (parsedHtml: any) => {
//   let isHeading = false;
//   let boldText = false;
//   let italicText = false;
//   let underlinedText = false;
//   let stringToReturn = "";

//   // check if the text is a heading
//   if (parsedHtml?.type === "h1") {
//     isHeading = true;
//   }

//   if (!isHeading) {
//     return {
//       boldText,
//       isHeading,
//       italicText,
//       underlinedText,
//       stringToReturn,
//     };
//   } else {
//     stringToReturn = parsedHtml?.props?.children?.toString();
//   }

//   // check if the text is bold
//   if (parsedHtml?.props?.children?.type === "strong") {
//     boldText = true;
//   }

//   if (boldText) {
//     stringToReturn = parsedHtml?.props?.children?.props?.children?.toString();
//   }

//   // check if the text is Italic
//   if (boldText && parsedHtml?.props?.children?.props?.children?.type === "em") {
//     italicText = true;
//   }

//   if (!boldText && parsedHtml?.props?.children?.type === "em") {
//     italicText = true;
//   }

//   if (boldText && italicText) {
//     stringToReturn =
//       parsedHtml?.props?.children?.props?.children?.props?.children?.toString();
//   }

//   if (!boldText && italicText) {
//     stringToReturn = parsedHtml?.props?.children?.props?.children?.toString();
//   }

//   // check if the text is underlined.
//   if (!boldText && !italicText && parsedHtml?.props?.children?.type === "u") {
//     underlinedText = true;
//   }

//   if (
//     boldText &&
//     !italicText &&
//     parsedHtml?.props?.children?.props?.children?.type === "u"
//   ) {
//     underlinedText = true;
//   }

//   if (
//     !boldText &&
//     italicText &&
//     parsedHtml?.props?.children?.props?.children?.type === "u"
//   ) {
//     underlinedText = true;
//   }

//   if (
//     boldText &&
//     italicText &&
//     parsedHtml?.props?.children?.props?.children?.props?.children?.type === "u"
//   ) {
//     underlinedText = true;
//   }

//   if ((boldText || italicText) && underlinedText) {
//     stringToReturn =
//       parsedHtml?.props?.children?.props?.children?.props?.children?.toString();
//   }

//   if (!boldText && !italicText && underlinedText) {
//     stringToReturn = parsedHtml?.props?.children?.props?.children?.toString();
//   }

//   if (boldText && italicText && underlinedText) {
//     stringToReturn =
//       parsedHtml?.props?.children?.props?.children?.props?.children?.props?.children?.toString();
//   }

//   return { boldText, isHeading, italicText, underlinedText, stringToReturn };
// };

// export const getFormattedHumanizedEssayHTML = (
//   editorHTML: string,
//   mongoDBUser: any,
//   title: string = "Untitled Document",
// ) => {
//   if (!editorHTML) {
//     return;
//   }
//   let name = "";
//   console.log(mongoDBUser?.firstName);
//   if (mongoDBUser?.firstName || mongoDBUser?.lastName)
//     name = mongoDBUser?.firstName + " " + mongoDBUser?.lastName;

//   const today = new Date();
//   const formattedDate = today.toLocaleDateString("en", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
//   console.log(`Today's date is ${formattedDate}`);

//   const htmlHeader = `
//       <p style="font-family: Serif; font-size: 1.5em; margin-top: 1em; margin-bottom: 0.5em; padding: 0.2em 4.0em;">
//         ${name ? name : ""}<br />
//         ${title ? title : ""} <br />
//         ${formattedDate} <br />
//       </p>
//       <br /><br />
//     `;

//   let html = htmlHeader + editorHTML;

//   // replace <h1 with <h1 style="font-size: 1.5em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; padding: 3em 0em;">
//   html = html.replace(
//     /<h1/g,
//     '<h1 style="font-family: Serif; font-size: 1.5em; font-weight: bold; margin-top: 0.1em; margin-bottom: 0.1em; padding: 0.2em 4.0em;"',
//   );
//   // replace <p with <p style="font-family: Serif; margin-top: 0.1em; margin-bottom: 0.1em; padding: 0.2em 0.5em;">
//   html = html.replace(
//     /<p/g,
//     '<p style="font-family: Serif; margin-top: 0.1em; margin-bottom: 0.1em; padding: 0.2em 4.0em;"',
//   );
//   // replace all <mark style="background: anything">
//   html = html.replace(
//     /<mark data-color="[^"]+" style="background-color: [^;]+; color: inherit">/g,
//     "",
//   );
//   // replace all </mark>
//   html = html.replace(/<\/mark>/g, "");

//   return html;
// };

// export const separateReferencesAndText = (text: string) => {
//   if (!text) {
//     return {
//       textWithoutReferences: "",
//       references: "",
//     };
//   }
//   let references = text.includes("References")
//     ? text.split("References")[1]
//     : "";
//   let textWithoutReferences = text.split("References")[0].trim();

//   if (!references) {
//     references = "";
//   } else if (references[0] === ":") {
//     references = references.slice(1).trim();
//   }

//   return {
//     textWithoutReferences,
//     references,
//   };
// };

// export const handleExportAsPdf = (
//   editorHTML: string,
//   mongoDBUser: any,
//   title: string = "Untitled Document",
// ) => {
//   let html = getFormattedHumanizedEssayHTML(editorHTML, mongoDBUser, title);

//   let fileTitle = "file.pdf";
//   if (title) {
//     try {
//       fileTitle = title.replace(/[^a-zA-Z0-9]/g, "-");
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   const doc = new jsPDF();
//   doc.setFontSize(12);

//   doc.html(html || "", {
//     callback: function (doc) {
//       doc.save(fileTitle + ".pdf");
//     },
//     x: 5,
//     y: 5,
//     width: 200, //target width in the PDF document
//     windowWidth: 650,
//   });
// };

// export const exportAsDocx = async (editor: any, title: string) => {
//   try {
//     const nodeSerializer = {
//       ...defaultNodes,
//       hardBreak: defaultNodes.hard_break,
//       codeBlock: defaultNodes.code_block,
//       orderedList: defaultNodes.ordered_list,
//       listItem: defaultNodes.list_item,
//       bulletList: defaultNodes.bullet_list,
//       horizontalRule: defaultNodes.horizontal_rule,
//       image(state: any, node: any) {
//         // No image
//         state.renderInline(node);
//         state.closeBlock(node);
//       },
//     };
//     const docxSerializer = new DocxSerializer(nodeSerializer, defaultMarks);

//     const opts = {
//       getImageBuffer(src: any) {
//         return Buffer.from("Real buffer here");
//       },
//     };

//     const wordDocument = docxSerializer.serialize(editor.state.doc, opts);

//     await writeDocx(wordDocument, (buffer) => {
//       const formattedTitle = title.replace(/[^a-zA-Z0-9]/g, "-");

//       saveAs(new Blob([buffer]), formattedTitle + ".docx");
//     });
//   } catch (e) {
//     toast.error(
//       "Error exporting to Word: some unsupported elements were used. Please remove them.",
//       {
//         duration: 5000,
//       },
//     );
//     console.error(e);
//   }
// };

// export const saveTitlesWithFormatting = (html: string) => {
//   // find titles from html, save and return them in an array.
//   let boldTitles: any[] = [];
//   // parsing html and saving their formatting.
//   try {
//     let parsedHtml = parse(html);

//     if (!Array.isArray(parsedHtml)) {
//       return;
//     }
//     parsedHtml?.map((parsedHtml) => {
//       const {
//         boldText,
//         italicText,
//         underlinedText,
//         isHeading,
//         stringToReturn,
//       } = checkIfBoldItalicOrUnderline(parsedHtml);

//       if (isHeading) {
//         boldTitles.push({
//           boldText,
//           underlinedText,
//           italicText,
//           stringToReturn,
//           isHeading,
//         });
//       }
//     });
//   } catch (e) {
//     // there is nothing to parse. Do nothing.
//   }
//   return boldTitles;
// };

// export const newCheckForBibliography = (returnedText = "") => {
//   const editorHTML = useStealth.getState().editorText;

//   return {
//     returnedText: editorHTML,
//   };
// };

// export function stripHTML(html: string) {
//   // Create a new DOMParser instance
//   let parser = new DOMParser();

//   // Parse the HTML string into a document
//   let doc = parser.parseFromString(html, "text/html");

//   // Use textContent to get the text without HTML tags
//   return doc.body.textContent || "";
// }

// export const applyTitlesWithFormatting = (
//   rewrittenHTML: string,
//   boldTitles: any,
// ) => {
//   // bold titles updates with all the styles. check and apply them

//   // find titles and replace them with the boldTitles variable.
//   let updatedHTML = `<p>${rewrittenHTML}</p>`;
//   // older version of the variable
//   //let updatedHTML = rewrittenHTML;

//   boldTitles.forEach((title: any, index: number) => {
//     // searching for the text (headings)
//     const searchResult = updatedHTML.search((title as any).stringToReturn);
//     if (searchResult > 0) {
//       // if found. update the html returned.
//       updatedHTML = applyFormattingOnSingleTitle(title, updatedHTML, index);
//     }
//   });

//   // replace empty p tags
//   updatedHTML = updatedHTML.replaceAll("<p></p>", "");
//   return updatedHTML;
// };

// export const applyFormattingOnSingleTitle = (
//   title: any,
//   updatedHTML: any,
//   index: number,
// ) => {
//   const { boldText, italicText, isHeading, underlinedText, stringToReturn } =
//     title;

//   // the following code is commented out because at first the returned text had class="tiptap-paragraph" when it is first heading
//   // But now it is not comming with that class anymore.

//   // for index 0. we need to search the class tiptap.
//   // if (index === 0) {
//   //   if (boldText && italicText && underlinedText) {
//   //     updatedHTML = updatedHTML.replace(
//   //       `<p class="tiptap-paragraph">${stringToReturn}</p>`,
//   //       `<h1><strong><em><u>${stringToReturn}</u></em></strong></h1>`,
//   //     );
//   //     return updatedHTML;
//   //   }

//   //   if (boldText && italicText) {
//   //     updatedHTML = updatedHTML.replace(
//   //       `<p class="tiptap-paragraph">${stringToReturn}</p>`,
//   //       `<h1><strong><em>${stringToReturn}</em></strong></h1>`,
//   //     );
//   //     return updatedHTML;
//   //   }

//   //   if (boldText && underlinedText) {
//   //     updatedHTML = updatedHTML.replace(
//   //       `<p class="tiptap-paragraph">${stringToReturn}</p>`,
//   //       `<h1><strong><u>${stringToReturn}</u></strong></h1>`,
//   //     );
//   //     return updatedHTML;
//   //   }

//   //   if (italicText && underlinedText) {
//   //     updatedHTML = updatedHTML.replace(
//   //       `<p class="tiptap-paragraph">${stringToReturn}</p>`,
//   //       `<h1><em><u>${stringToReturn}</u></em></h1>`,
//   //     );
//   //     return updatedHTML;
//   //   }

//   //   if (boldText) {
//   //     updatedHTML = updatedHTML.replace(
//   //       `<p class="tiptap-paragraph">${stringToReturn}</p>`,
//   //       `<h1><strong>${stringToReturn}</strong></h1>`,
//   //     );
//   //     return updatedHTML;
//   //   }

//   //   if (italicText) {
//   //     updatedHTML = updatedHTML.replace(
//   //       `<p class="tiptap-paragraph">${stringToReturn}</p>`,
//   //       `<h1><em>${stringToReturn}</em></h1>`,
//   //     );
//   //     return updatedHTML;
//   //   }

//   //   if (underlinedText) {
//   //     updatedHTML = updatedHTML.replace(
//   //       `<p class="tiptap-paragraph">${stringToReturn}</p>`,
//   //       `<h1><u>${stringToReturn}</u></h1>`,
//   //     );
//   //     return updatedHTML;
//   //   }

//   //   updatedHTML = updatedHTML.replace(
//   //     `<p class="tiptap-paragraph">${stringToReturn}</p>`,
//   //     `<h1>${stringToReturn}</h1>`,
//   //   );

//   //   return updatedHTML;
//   // } else {
//   // if index not equal to 0

//   if (isHeading) {
//     updatedHTML = updatedHTML.replace(
//       `${stringToReturn}`,
//       `<h1>${stringToReturn}</h1>`,
//     );
//     return updatedHTML;
//   }
//   if (boldText && italicText && underlinedText) {
//     updatedHTML = updatedHTML.replace(
//       `${stringToReturn}`,
//       `<h1><strong><em><u>${stringToReturn}</u></em></strong></h1>`,
//     );

//     return updatedHTML;
//   }

//   if (boldText && italicText) {
//     updatedHTML = updatedHTML.replace(
//       `${stringToReturn}`,
//       `<h1><strong><em>${stringToReturn}</em></strong></h1>`,
//     );

//     return updatedHTML;
//   }

//   if (boldText && underlinedText) {
//     updatedHTML = updatedHTML.replace(
//       `${stringToReturn}`,
//       `<h1><strong><u>${stringToReturn}</u></strong></h1>`,
//     );

//     return updatedHTML;
//   }

//   if (italicText && underlinedText) {
//     updatedHTML = updatedHTML.replace(
//       `${stringToReturn}`,
//       `<h1><em><u>${stringToReturn}</u></em></h1>`,
//     );

//     return updatedHTML;
//   }

//   if (boldText) {
//     updatedHTML = updatedHTML.replace(
//       `${stringToReturn}`,
//       `<h1><strong>${stringToReturn}</strong></h1>`,
//     );

//     return updatedHTML;
//   }

//   if (italicText) {
//     updatedHTML = updatedHTML.replace(
//       `${stringToReturn}`,
//       `<h1><em>${stringToReturn}</em></h1>`,
//     );

//     return updatedHTML;
//   }

//   if (underlinedText) {
//     updatedHTML = updatedHTML.replace(
//       `${stringToReturn}`,
//       `<h1><u>${stringToReturn}</u></h1>`,
//     );

//     return updatedHTML;
//   }

//   updatedHTML = updatedHTML.replace(
//     `${stringToReturn}`,
//     `<h1>${stringToReturn}</h1>`,
//   );

//   return updatedHTML;
//   //}
// };

// export function saveTextAsDoc(presetText?: string) {
//   let text = presetText ?? useStealth.getState().editorText;
//   var data = new Blob([text], { type: "application/msword" });
//   var textFile = window.URL.createObjectURL(data);
//   if (document.getElementById("download")) {
//     document.body.removeChild(document.getElementById("download") as any);
//   }
//   var a = document.createElement("a");
//   a.setAttribute("id", "download");
//   a.setAttribute("download", "Conch Stealth.doc");
//   a.setAttribute("href", textFile);
//   a.style.display = "none";
//   document.body.appendChild(a);
//   a.click();
//   toast.success("File Downloaded", { duration: 2000 });
// }

// export const insertTextFromFile = async (file: any, mongoDBUser: any) => {
//   toast.loading("Parsing File...");
//   const fileType = getFileType(file);

//   // if file.size > (20MB), then throw error
//   if (file.size > 20242880) {
//     toast.error("File size should be less than 5MB");
//     return;
//   }
//   let fileTranscript;
//   try {
//     switch (fileType) {
//       case "pdf":
//         fileTranscript = await readPdfFile(file, mongoDBUser);
//         break;
//       case "doc":
//         const convertedDoc = await convertToDoc(file);
//         fileTranscript = await readPdfFile(convertedDoc, mongoDBUser);
//         break;
//       case "docx":
//         const convertedDocx = await convertToDocx(file);
//         fileTranscript = await readPdfFile(convertedDocx, mongoDBUser);
//         break;
//       case "pptx":
//         const convertedPPTX = await convertToPPTX(file);
//         fileTranscript = await readPdfFile(convertedPPTX, mongoDBUser);
//         break;
//       case "ppt":
//         const convertedPPT = await convertToPPT(file);
//         fileTranscript = await readPdfFile(convertedPPT, mongoDBUser);
//         break;
//       default:
//         console.log(fileType);
//         Analytics.track("Unsupported File Type", {
//           fileType: fileType,
//           location: "Study File Upload",
//         });
//         console.log("Unsupported file type");
//         toast.error(
//           "We are hard at work adding support for this file type, hope to bring it to you soon!",
//         );
//         return;
//     }
//     useStealth.setState({ editorText: fileTranscript });

//     console.log(fileTranscript);
//   } catch (err) {
//     toast.error("Error while processing files");
//     console.log(err);
//     return;
//   } finally {
//     toast.remove();
//   }
// };

// export async function readPdfFile(file: any, mongoDBUser: any) {
//   try {
//     const userSamplesResponse = await parsePdfFile(file);

//     return userSamplesResponse.parsedText;
//   } catch (err) {
//     console.log(err);
//     return { err: err };
//   }
// }
// export function isHTML(text: string) {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(text, "text/html");
//   return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
// }

// export const resetStealth = () => {
//   useStealth.setState({
//     editorText: ``,
//     cameToStealthFrom: null,
//     stealthedText: ``,
//     score: 0,
//     checkedForAI: false,
//     currentlyRewritingCardId: -1,
//     rewriteRefs: [],
//     rewriteProgress: 0,
//     isRewriting: false,
//     humanizeProgress: 0,
//     isLoading: false,
//     stealthMode: "",
//     rewriteObjects: [],
//     textBeforeHumanizingAll: "",
//     lastHumanizedBypassMethod: "",
//     humanizedCount: 0,
//     pplPerSentence: 0,
//     showFeedback: false,
//     showBackConfirmModal: false,
//     grammerImprovements: [],
//     justRewritten: false,
//     textImprovements: [],
//   });
// };

// export function divideTextInto75To100Words(text: string) {
//   const sentences = text.match(/[^\.!\?]+[\.!\?]+/g);
//   if (!sentences) return [];

//   let snippets = [];
//   let snippet = "";
//   let wordCount = 0;

//   const countWords = (str: string) => str.split(/\s+/).filter(Boolean).length;

//   for (let sentence of sentences) {
//     const sentenceWordCount = countWords(sentence);

//     if (wordCount + sentenceWordCount > 100) {
//       snippets.push(snippet.trim());
//       snippet = sentence;
//       wordCount = sentenceWordCount;
//     } else {
//       snippet += " " + sentence;
//       wordCount += sentenceWordCount;
//     }
//   }

//   if (snippet.trim().length > 0) {
//     snippets.push(snippet.trim());
//   }

//   return snippets;
// }
