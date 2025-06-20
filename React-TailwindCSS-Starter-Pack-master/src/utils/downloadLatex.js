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

export function convertFeedbackToLatex(feedback) {
  // Step 1: Extract ATS Resume Section
  const start = feedback.indexOf("ATS-Optimized Resume Content:");
  if (start === -1) {
    console.warn("No optimized resume found.");
    return "";
  }

  const resumeText = feedback.slice(start + "ATS-Optimized Resume Content:".length).trim();
  const sections = parseResumeSections(resumeText);
  return generateLatexFromSections(sections);
}

// Step 2: Parse text into structured resume sections
function parseResumeSections(resumeText) {
  const sections = {};
  let current = "header";
  sections[current] = [];

  const lines = resumeText.split("\n").map((line) => line.trim());

  for (let line of lines) {
    if (
      ["Summary", "Education", "Skills", "Experience", "Projects", "Achievements"].includes(line)
    ) {
      current = line.toLowerCase();
      sections[current] = [];
    } else {
      if (sections[current]) sections[current].push(line);
    }
  }

  return sections;
}

// Step 3: Generate LaTeX from structured sections
function generateLatexFromSections(sections) {
  const listify = (arr) =>
    arr
      .filter((item) => item && item.length > 0)
      .map((item) => `\\item ${cleanLatex(item)}`)
      .join("\n");

  return `
\\documentclass[a4paper,10pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{hyperref}
\\setlist[itemize]{noitemsep, topsep=0pt}
\\titleformat{\\section}{\\normalfont\\Large\\bfseries}{}{0em}{}

\\begin{document}

% Name and Contact
\\begin{center}
  {\\LARGE \\textbf{${cleanLatex(sections.header?.[0] || "Your Name")}}} \\\\
  ${cleanLatex(sections.header?.slice(1).join(" | ") || "")}
\\end{center}

% Summary
\\section*{Summary}
${cleanLatex(sections.summary?.join(" ") || "")}

% Education
\\section*{Education}
\\begin{itemize}
${listify(sections.education || [])}
\\end{itemize}

% Skills
\\section*{Skills}
\\begin{itemize}
${listify(sections.skills || [])}
\\end{itemize}

% Experience
\\section*{Experience}
\\begin{itemize}
${listify(sections.experience || [])}
\\end{itemize}

% Projects
\\section*{Projects}
\\begin{itemize}
${listify(sections.projects || [])}
\\end{itemize}

% Achievements
\\section*{Achievements}
\\begin{itemize}
${listify(sections.achievements || [])}
\\end{itemize}

\\end{document}
  `.trim();
}

function cleanLatex(text) {
  if (!text) return "";
  return text
    .replace(/\*\*/g, "") // remove markdown bold
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\~{}')
    .replace(/\^/g, '\\^{}')
    .replace(/\\/g, '\\textbackslash{}');
}

