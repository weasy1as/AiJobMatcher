import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

  const location = useLocation();
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/history", label: "History" },
  ];

  return (
    <nav className="w-full bg-blue-700 py-4 px-6 flex items-center justify-between shadow">
      <div className="flex items-center space-x-8">
        <span className="text-white text-2xl font-extrabold tracking-tight">
          AI Job Matcher
        </span>
        {userEmail && (
          <div className="flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-white font-medium hover:underline transition px-2 py-1 rounded ${
                  location.pathname === link.to ? "bg-blue-900" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
      {userEmail && (
        <div className="flex items-center space-x-4">
          <span className="text-white font-medium">{userEmail}</span>
          <button
            onClick={handleSignOut}
            className="bg-white text-blue-700 font-semibold px-4 py-1 rounded hover:bg-blue-100 transition"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
