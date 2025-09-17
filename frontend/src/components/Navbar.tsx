import { useEffect, useState } from "react";
import { supabase } from "../helper/supabaseClient";

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email || null);
    };
    getUser();
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user?.email || null);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <nav className="w-full bg-blue-700 py-4 px-6 flex items-center justify-between shadow">
      <div className="text-white text-2xl font-extrabold tracking-tight">
        AI Job Matcher
      </div>
      {userEmail && (
        <div className="flex items-center space-x-4">
          <span className="text-white font-medium">
            <p className="font-bold text-white">Signed in as:</p> {userEmail}
          </span>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white hover:scale-110 font-semibold px-4 py-1 rounded hover:bg-red-600 transition cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
