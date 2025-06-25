// import { Document, Packer, Paragraph, TextRun } from "docx";

// export function downloadWordFile(feedback, filename = "resume_feedback.docx") {
//   if (typeof window === "undefined") {
//     console.error("This function must be run in a browser environment.");
//     return;
//   }

//   const resumeSectionIndex = feedback.indexOf("Optimized Resume:");
//   const feedbackContent =
//     resumeSectionIndex !== -1
//       ? feedback.slice(0, resumeSectionIndex).trim()
//       : feedback.trim();

//   const resumeContent =
//     resumeSectionIndex !== -1
//       ? feedback.slice(resumeSectionIndex).replace("Optimized Resume:", "").trim()
//       : "";

//   const doc = new Document({
//     sections: [
//       {
//         children: [
//           new Paragraph({
//             children: [
//               new TextRun({
//                 text: "Resume Review Feedback",
//                 bold: true,
//                 size: 48,
//               }),
//             ],
//           }),
//           ...feedbackContent.split("\n").map((line) =>
//             new Paragraph({
//               children: [
//                 new TextRun({
//                   text: line,
//                   size: 24,
//                 }),
//               ],
//             })
//           ),
//           ...(resumeContent
//             ? [
//                 new Paragraph({
//                   children: [
//                     new TextRun({
//                       text: "Optimized Resume",
//                       bold: true,
//                       break: 1,
//                       size: 48,
//                     }),
//                   ],
//                 }),
//                 ...resumeContent.split("\n").map((line) =>
//                   new Paragraph({
//                     children: [
//                       new TextRun({
//                         text: line,
//                         size: 24,
//                       }),
//                     ],
//                   })
//                 ),
//               ]
//             : []),
//         ],
//       },
//     ],
//   });

//   // 💡 Trigger download
//   Packer.toBlob(doc).then((blob) => {
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url); // cleanup
//   });
// }
// convertFeedbackToLatex.js

// export function convertFeedbackToLatex(feedback) {
//   // Step 1: Extract ATS Resume Section
//   const start = feedback.indexOf("ATS-Optimized Resume Content:");
//   if (start === -1) {
//     console.warn("No optimized resume found.");
//     console.log("Full Feedback:", feedback);

//     return "";
//   }

//   const resumeText = feedback.slice(start + "ATS-Optimized Resume Content:".length).trim();
//   const sections = parseResumeSections(resumeText);
//   return generateLatexFromSections(sections);
// }

// // Step 2: Parse text into structured resume sections
// // Dynamically parse sections based on formatting
// function parseResumeSections(resumeText) {
//   const lines = resumeText.split("\n").map((line) => line.trim()).filter(Boolean);

//   const sections = {};
//   let currentSection = null;

//   for (const line of lines) {
//     const isLikelySection = /^[A-Z][A-Za-z ]{1,30}$/.test(line); // Title-like line
//     if (isLikelySection) {
//       currentSection = line;
//       sections[currentSection] = [];
//     } else if (currentSection) {
//       sections[currentSection].push(line);
//     }
//   }

//   return sections;
// }

// // Generate LaTeX from any dynamic sections
// function generateLatexFromSections(sections) {
//   const listify = (arr) =>
//     arr
//       .filter((item) => item && item.length > 0)
//       .map((item) => `\\item ${cleanLatex(item)}`)
//       .join("\n");

//   const sectionLatex = Object.entries(sections)
//     .map(([title, items]) => {
//       if (title.toLowerCase() === 'summary') {
//         return `\\section*{${cleanLatex(title)}}\n${cleanLatex(items.join(" "))}`;
//       } else if (title.toLowerCase() === 'header') {
//         return ''; // skip, handled separately
//       } else {
//         return `\\section*{${cleanLatex(title)}}\n\\begin{itemize}\n${listify(items)}\n\\end{itemize}`;
//       }
//     })
//     .join("\n\n");

//   const header = sections["Header"] || [];
//   const name = cleanLatex(header[0] || "Your Name");
//   const contact = cleanLatex(header.slice(1).join(" | ") || "");

//   return `
// \\documentclass[a4paper,10pt]{article}
// \\usepackage[margin=1in]{geometry}
// \\usepackage{enumitem}
// \\usepackage{titlesec}
// \\usepackage{hyperref}
// \\setlist[itemize]{noitemsep, topsep=0pt}
// \\titleformat{\\section}{\\normalfont\\Large\\bfseries}{}{0em}{}

// \\begin{document}

// \\begin{center}
//   {\\LARGE \\textbf{${name}}} \\\\
//   ${contact}
// \\end{center}

// ${sectionLatex}

// \\end{document}
// `.trim();
// }

// function cleanLatex(text) {
//   if (!text) return "";
//   return text
//     .replace(/\*\*/g, "") // remove markdown bold
//     .replace(/&/g, '\\&')
//     .replace(/%/g, '\\%')
//     .replace(/\$/g, '\\$')
//     .replace(/#/g, '\\#')
//     .replace(/_/g, '\\_')
//     .replace(/{/g, '\\{')
//     .replace(/}/g, '\\}')
//     .replace(/~/g, '\\~{}')
//     .replace(/\^/g, '\\^{}')
//     .replace(/\\/g, '\\textbackslash{}');
// }

export function convertFeedbackToLatex(feedback) {
  // Step 1: Detect and extract resume content
  const triggerPhrases = [
    "ATS-Optimized Resume Content:",
    "Optimized Resume:",
    "Resume:"
  ];

  let start = -1;
  let matchedTrigger = "";

  for (const trigger of triggerPhrases) {
    start = feedback.indexOf(trigger);
    if (start !== -1) {
      matchedTrigger = trigger;
      break;
    }
  }

  let resumeText = "";

  if (start !== -1) {
    resumeText = feedback.slice(start + matchedTrigger.length).trim();
  } else if (/education|experience|skills|projects|summary/i.test(feedback)) {
    console.warn("No trigger phrase found, using full feedback as fallback.");
    resumeText = feedback.trim();
  } else {
    console.warn("No optimized resume found.");
    console.log("Full Feedback:", feedback);
    return "";
  }

  const sections = parseResumeSections(resumeText);
  return generateLatexFromSections(sections);
}

// Step 2: Parse resume into structured sections
function parseResumeSections(resumeText) {
  const lines = resumeText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = {};
  let currentSection = null;

  for (const line of lines) {
    const isLikelySection = /^[A-Z][A-Za-z ]{1,30}$/.test(line);
    if (isLikelySection) {
      currentSection = line;
      sections[currentSection] = [];
    } else if (currentSection) {
      sections[currentSection].push(line);
    }
  }

  return sections;
}

// Step 3: Generate LaTeX code from sections
function generateLatexFromSections(sections) {
  const listify = (arr) =>
    arr
      .filter((item) => item && item.length > 0)
      .map((item) => `\\item ${cleanLatex(item)}`)
      .join("\n");

  const sectionLatex = Object.entries(sections)
    .map(([title, items]) => {
      const titleLower = title.toLowerCase();
      if (titleLower === "summary") {
        return `\\section*{${cleanLatex(title)}}\n${cleanLatex(items.join(" "))}`;
      } else if (titleLower === "header") {
        return ""; // handled separately
      } else {
        return `\\section*{${cleanLatex(title)}}\n\\begin{itemize}\n${listify(items)}\n\\end{itemize}`;
      }
    })
    .join("\n\n");

  const header = sections["Header"] || [];
  const name = cleanLatex(header[0] || "Your Name");
  const contact = cleanLatex(header.slice(1).join(" | ") || "");

  return `
\\documentclass[a4paper,10pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{hyperref}
\\setlist[itemize]{noitemsep, topsep=0pt}
\\titleformat{\\section}{\\normalfont\\Large\\bfseries}{}{0em}{}

\\begin{document}

\\begin{center}
  {\\LARGE \\textbf{${name}}} \\\\
  ${contact}
\\end{center}

${sectionLatex}

\\end{document}
`.trim();
}

// Helper to escape LaTeX special characters
function cleanLatex(text) {
  if (!text) return "";
  return text
    .replace(/\*\*/g, "")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\~{}")
    .replace(/\^/g, "\\^{}")
    .replace(/\\/g, "\\textbackslash{}");
}
