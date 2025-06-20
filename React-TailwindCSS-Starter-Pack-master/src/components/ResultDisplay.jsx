import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import jsPDF from 'jspdf';

const ResultDisplay = ({ result, resultCount }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!result) {
      setDisplayedText('');
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + result.charAt(index));
      index++;

      if (index >= result.length) {
        clearInterval(interval);
      }
    }, 20); // Typing speed: smaller = faster (adjust if you want)

    return () => clearInterval(interval); // Cleanup interval when component unmounts
  }, [result]);

  const downloadAsPDF = () => {
    if (!result) return;
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(result, 180);
    pdf.text(lines, 10, 10);
    pdf.save(`Generated_Letter_${resultCount}.pdf`);
  };

  const downloadAsDocx = async () => {
    if (!result) return;

    // Split result into paragraphs if needed (e.g., if text includes line breaks)
    const paragraphs = result.split('\n').map((text) => {
      return new Paragraph({
        children: [new TextRun(text)],
      });
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Adding header and formatting for the text content
            new Paragraph({
              children: [new TextRun('Generated Letter')],
              alignment: 'center',
              heading: 1, // Heading style for the title
            }),
            new Paragraph({
              children: [new TextRun(`Letter #${resultCount}`)],
              alignment: 'center',
              heading: 2, // Subheading style for letter number
            }),
            // Adding the actual letter content with formatting
            ...paragraphs,
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Generated_Letter_${resultCount}.docx`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-50 rounded-xl shadow-md min-h-[200px] flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Generated Letter {resultCount}
      </h2>

      <div className="whitespace-pre-line text-gray-700 leading-relaxed mb-4 min-h-[150px] w-[40rem]">
        {displayedText || 'Your generated letter will appear here...'}
      </div>

      <div className="flex gap-4">
        <button
          onClick={downloadAsPDF}
          disabled={!result}
          className={`px-4 py-2 rounded transition ${
            result ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Download as PDF
        </button>
        <button
          onClick={downloadAsDocx}
          disabled={!result}
          className={`px-4 py-2 rounded transition ${
            result ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Download as Word
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
