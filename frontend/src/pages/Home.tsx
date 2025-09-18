import { useNavigate } from "react-router-dom";
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
      console.log(data.session.user.id);
      if (data.session === null) {
        navigate("/login");
      }
    };
    checkSession();
  }, [navigate]);

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

  const handleMatch = async () => {
    if (!resumeFile) return;
    setLoading(true);
    setError("");
    setMatchResult(null);
    const { data } = await supabase.auth.getSession();
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobTitle", "Backend Developer"); // could add an input later
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
      setMatchResult(result);
    } catch (err) {
      setError("Something went wrong! Check console.");
      setMatchResult(null);
      console.error("Error calling backend:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-200">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl p-10">
          <h1 className="text-3xl font-extrabold text-blue-800 mb-4 text-center">
            AI Job Matcher
          </h1>
          <form className="space-y-6 text-left">
            {/* Resume Upload */}
            <div>
              <label className="block font-semibold mb-1">
                Upload Resume (PDF or DOCX)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="block w-full border border-blue-200 rounded-lg px-3 py-2"
              />
              {resumeFile && (
                <div className="text-sm text-gray-600 mt-1">
                  Selected: {resumeFile.name}
                </div>
              )}
            </div>
            {/* Job Description Paste */}
            <div>
              <label className="block font-semibold mb-1">
                Paste Job Description
              </label>
              <textarea
                rows={5}
                className="w-full border border-blue-200 rounded-lg px-3 py-2"
                placeholder="Paste or write the job description here..."
                value={jobDescription}
                onChange={handleJobDescriptionChange}
              />
            </div>
            {/* Match Button */}
            <button
              type="button"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition text-lg shadow disabled:opacity-60"
              disabled={!resumeFile || !jobDescription || loading}
              onClick={handleMatch}
            >
              {loading ? "Matching..." : "Match"}
            </button>
            {error && (
              <div className="text-red-600 text-center font-semibold mt-2">
                {error}
              </div>
            )}
            {matchResult && (
              <MatchResult
                score={matchResult.score}
                highlights={matchResult.highlights || []}
                missingKeywords={matchResult.missingKeywords || []}
                suggestions={matchResult.suggestions || []}
                insights={matchResult.insights}
              />
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
