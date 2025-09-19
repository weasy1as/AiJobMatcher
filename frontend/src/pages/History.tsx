import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";
import MatchResult from "../components/MatchResult";
import Navbar from "../components/Navbar";

export default function History() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError("");
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate("/login");
        return;
      }
      try {
        // Replace with your actual backend endpoint for fetching history
        const response = await fetch(
          `http://localhost:8080/api/matches/user/${sessionData.session.user.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch history");
        const result = await response.json();
        setMatches(result);
      } catch (err) {
        setError("Could not load history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-200">
      <Navbar />
      <main className="flex-1 flex flex-col items-center py-10">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6">
          Previous Matches
        </h1>
        {loading && <div className="text-blue-700">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && matches.length === 0 && (
          <div className="text-gray-500">No previous matches found.</div>
        )}
        <div className="w-full max-w-2xl space-y-8">
          {matches.map((match, idx) => (
            <MatchResult
              key={idx}
              score={match.score}
              highlights={match.highlights || []}
              missingKeywords={match.missingKeywords || []}
              suggestions={match.suggestions || []}
              insights={match.insights}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
