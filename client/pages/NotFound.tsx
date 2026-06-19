import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#121414] to-[#121414]">
      <div className="text-center px-6">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 text-[#E2E2E2]">404</h1>
        <p className="text-xl md:text-2xl text-[#C8C6C5] mb-8">Oops! Page not found</p>
        <Link to="/" className="inline-block px-8 py-3 bg-white text-black font-normal text-base hover:bg-gray-200 transition">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
