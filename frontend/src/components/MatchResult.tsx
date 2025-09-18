import React from "react";

interface MatchResultProps {
  score: number;
  highlights: string[];
  missingKeywords: string[];
  suggestions: string[];
  insights?: string;
}

const MatchResult: React.FC<MatchResultProps> = ({
  score,
  highlights,
  missingKeywords,
  suggestions,
  insights,
}) => {
  return (
    <div className="mt-8 p-6 bg-blue-50 rounded-2xl shadow border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xl font-bold text-blue-800">Match Score</span>
        <span className="text-3xl font-extrabold text-blue-600">{score}%</span>
      </div>
      <div className="mb-3">
        <span className="font-semibold text-blue-700">
          Matched Skills/Keywords:
        </span>
        <ul className="list-disc ml-6 text-green-700">
          {highlights.length > 0 ? (
            highlights.map((h, i) => <li key={i}>{h}</li>)
          ) : (
            <li className="text-gray-400">None</li>
          )}
        </ul>
      </div>
      <div className="mb-3">
        <span className="font-semibold text-blue-700">Missing Keywords:</span>
        <ul className="list-disc ml-6 text-red-600">
          {missingKeywords.length > 0 ? (
            missingKeywords.map((k, i) => <li key={i}>{k}</li>)
          ) : (
            <li className="text-gray-400">None</li>
          )}
        </ul>
      </div>
      <div className="mb-3">
        <span className="font-semibold text-blue-700">Suggestions:</span>
        <ul className="list-disc ml-6 text-blue-800">
          {suggestions.length > 0 ? (
            suggestions.map((s, i) => <li key={i}>{s}</li>)
          ) : (
            <li className="text-gray-400">None</li>
          )}
        </ul>
      </div>
      {insights && (
        <div className="mt-4 p-3 bg-white rounded border border-blue-100">
          <span className="font-semibold text-blue-700">AI Insights:</span>
          <div className="text-gray-700 mt-1">{insights}</div>
        </div>
      )}
    </div>
  );
};

export default MatchResult;
