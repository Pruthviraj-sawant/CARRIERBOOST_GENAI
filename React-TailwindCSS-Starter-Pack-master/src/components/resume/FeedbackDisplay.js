import React from 'react';
import { MessageCircle } from 'lucide-react';
import { convertFeedbackToLatex  } from '../../utils/downloadLatex'; // Adjust path as needed



  
function FeedbackDisplay({ feedback }) {
 
  const [downloading, setDownloading] = React.useState(false);
const handleDownload = async () => {
  setDownloading(true);
  try {
    const latexCode = convertFeedbackToLatex(feedback);
    console.log(latexCode); // Optional: Preview in devtools

    // Create a blob and trigger download
    const blob = new Blob([latexCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ATS_Optimized_Resume.tex";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
  } finally {
    setDownloading(false);
  }
};


  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 border-b pb-4 mb-4">
        <MessageCircle className="text-blue-500" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Resume Feedback</h2>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <div className="prose prose-blue max-w-none text-gray-700">
          <p className="whitespace-pre-line">{feedback}</p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
      
        <button
  className="px-4 py-2 ml-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
  onClick={handleDownload}
  disabled={downloading}
>
  {downloading ? "Downloading..." : "Download"}
</button>

      </div>
    </div>
  );
}

export default FeedbackDisplay;