import { data, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import MatchResult from "../components/MatchResult";
import { supabase } from "../helper/supabaseClient";

export default function Home() {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log(data.session);
      if (data.session === null) {
        navigate("/login");
      }
    };
    checkSession();
  }, [data, navigate]);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleJobDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDescription(e.target.value);
  };

  const handeCloseResult = () => {
    setMatchResult(null);
    setResumeFile(null);
    setJobDescription("");
    setError("");
  };

  const handleMatch = async () => {
    if (!resumeFile) return;
    setLoading(true);
    setError("");
    setMatchResult(null);
    const { data } = await supabase.auth.getSession();

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobTitle", "Backend Developer");
    formData.append("jobDescription", jobDescription);
    formData.append("userId", data.session.user.id);

    try {
      const response = await fetch("http://localhost:8080/api/ai/match", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();

      // 👇 try parsing insights
      let parsedInsights = {};
      try {
        parsedInsights = JSON.parse(result.insights);
      } catch (e) {
        console.error("Failed to parse insights JSON:", e);
      }

      setMatchResult({
        ...result,
        insights: parsedInsights, // replace raw string with object
      });

      console.log("Match result:", result);
    } catch (err) {
      setError("Something went wrong! Check console.");
      setMatchResult(null);
      console.error("Error calling backend:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-200 relative">
      <Navbar />
      <main
        className={`flex-1 flex flex-col items-center justify-center py-10 px-2 ${
          matchResult && matchResult.insights
            ? "blur-sm pointer-events-none select-none"
            : ""
        }`}
      >
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Welcome & Tips */}
          <div className="flex flex-col justify-center items-center bg-white/90 rounded-3xl shadow-xl p-8 mb-6 md:mb-0">
            <h1 className="text-4xl font-extrabold text-blue-800 mb-2 text-center">
              AI Job Matcher
            </h1>
            <p className="text-lg text-gray-700 mb-6 text-center">
              Upload your resume and a job description to get instant,
              AI-powered feedback and matching insights.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 w-full text-center">
              <h2 className="font-semibold text-blue-700 mb-1">
                Tip of the Day
              </h2>
              <p className="text-blue-900 text-sm">
                Use keywords from the job description in your resume to increase
                your match score!
              </p>
            </div>
          </div>
          {/* Right: Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col justify-center">
            <form className="space-y-6 text-left">
              {/* Resume Upload */}
              <div>
                <label className="block font-semibold mb-1 text-blue-700">
                  Upload Resume (PDF or DOCX)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="block w-full border border-blue-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                />
                {resumeFile && (
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">Selected:</span>{" "}
                    {resumeFile.name}
                  </div>
                )}
              </div>
              {/* Job Description Paste */}
              <div>
                <label className="block font-semibold mb-1 text-blue-700">
                  Paste Job Description
                </label>
                <textarea
                  rows={5}
                  className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                  placeholder="Paste or write the job description here..."
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                />
              </div>
              {/* Match Button */}
              <button
                type="button"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition text-lg shadow disabled:opacity-60"
                disabled={!resumeFile || !jobDescription || loading}
                onClick={handleMatch}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Matching...
                  </span>
                ) : (
                  "Match"
                )}
              </button>
              {error && (
                <div className="text-red-600 text-center font-semibold mt-2">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
      {/* Overlay Result Card */}
      {matchResult && matchResult.insights && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg mx-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative animate-fade-in">
              <button
                className="absolute top-4 right-4 text-blue-700 hover:text-blue-900 text-2xl font-bold focus:outline-none"
                onClick={handeCloseResult}
                aria-label="Close results"
              >
                ×
              </button>
              <MatchResult
                score={matchResult.insights.score}
                missingSkills={matchResult.insights.missingSkills || []}
                suggestions={matchResult.insights.profileUpdatesTips || []}
                summary={matchResult.insights.summary}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
