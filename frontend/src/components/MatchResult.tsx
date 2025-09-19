type MatchResultProps = {
  score: number;
  missingSkills: string[];
  suggestions: string[];
  summary: string;
};

export default function MatchResult({
  score,
  missingSkills,
  suggestions,
  summary,
}: MatchResultProps) {
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-bold text-blue-700 mb-2">
        Match Score: {score}%
      </h2>

      <p className="mb-4 text-gray-700">{summary}</p>

      {missingSkills.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-red-600">Missing Skills</h3>
          <ul className="list-disc list-inside text-gray-800">
            {missingSkills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <h3 className="font-semibold text-green-600">Suggestions</h3>
          <ul className="list-disc list-inside text-gray-800">
            {suggestions.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
