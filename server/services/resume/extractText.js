const pdfParse = require('pdf-parse');

async function extractTextFromPDF(fileBuffer) {
  const data = await pdfParse(fileBuffer);
  return data.text;
}

module.exports = extractTextFromPDF;
