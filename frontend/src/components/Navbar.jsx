import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Existing handler functions remain the same
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

  const handleProfileClick = (e) => {
    e.preventDefault();
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleMenuOption = (destination) => {
    setProfileMenuOpen(false);
    navigate(destination);
  };

  return (
    <nav className="fixed w-full top-0 z-50 galaxy-bg border-b border-indigo-500/30 shadow-lg">
      {/* Star Layers */}
      <div className="absolute inset-0 z-0">
        <div className="stars-small-1"></div>
        <div className="stars-medium-1"></div>
        <div className="stars-large-1"></div>
        <div className="nebula-1"></div>
        <div className="twinkle-1 twinkle-1a"></div>
        <div className="twinkle-1 twinkle-1b"></div>
        <div className="twinkle-1 twinkle-1c"></div>
        <div className="twinkle-1 twinkle-1d"></div>
        <div className="glow-star"></div>
        <div className="glow-star"></div>
        <div className="glow-star"></div>
        <div className="glow-star"></div>
      </div>

      <div className="relative z-10 backdrop-blur-sm bg-black/10">
        <div className="w-full px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500/40 to-purple-500/40 rounded-full opacity-50 group-hover:opacity-80 blur-sm group-hover:blur transition duration-300"></div>
                  <img
                    src={logo}
                    alt="World Explorer Logo"
                    className="h-14 w-14 relative z-10 group-hover:rotate-12 transition-transform duration-300"
                  />
                </div>
                <span className="ml-3 text-white text-2xl font-bold drop-shadow">
                  World Explorer
                </span>
              </Link>
            </div>

            {/* Links - Centered with auto margins */}
            <div className="hidden md:flex mx-auto">
              <div className="flex space-x-8">
                <NavItem to="/" label="Home" />
                <NavItem to="/favorites" label="Favorites" />
                <NavItem to="/explore" label="Explore Globe" />
                <NavItem to="/quiz" label="Quiz" />
              </div>
            </div>

            {/* User - Right aligned with less padding */}
            <div className="flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center bg-indigo-900/40 rounded-full border border-purple-400 px-4 py-2 relative">
                  <a
                    href="#"
                    onClick={handleProfileClick}
                    className="flex items-center"
                  >
                    <div className="w-9 h-9 bg-gradient-to-r from-indigo-700 to-purple-800 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="ml-2 text-indigo-200 font-medium hover:text-white transition-colors">
                      {user?.username || "Explorer"}
                    </span>
                  </a>

                  {/* Profile Dropdown Menu */}
                  {profileMenuOpen && (
                    <div
                      ref={profileMenuRef}
                      className="absolute right-0 mt-2 top-full w-48 rounded-md shadow-lg bg-indigo-900/90 backdrop-blur-sm border border-purple-500/50 z-50 overflow-hidden"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handleMenuOption("/profile")}
                          className="w-full text-left px-4 py-2 text-white hover:bg-indigo-700/70 flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          View Profile
                        </button>
                        <button
                          onClick={() => handleMenuOption("/quiz-results")}
                          className="w-full text-left px-4 py-2 text-white hover:bg-indigo-700/70 flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          View Quiz Results
                        </button>
                        {/* <button
                          onClick={() => handleMenuOption("/passport")}
                          className="w-full text-left px-4 py-2 text-white hover:bg-indigo-700/70 flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                            />
                          </svg>
                          View Passport
                        </button> */}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="ml-4 bg-purple-700 hover:bg-purple-800 text-white px-4 py-1 rounded-full"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full shadow"
                >
                  Join Now
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-2"
              >
                {isOpen ? "✖" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-black/50 px-4 pb-4 pt-2 space-y-2">
            <NavItem
              to="/"
              label="Home"
              mobile
              onClick={() => setIsOpen(false)}
            />
            <NavItem
              to="/explore"
              label="Explore Globe"
              mobile
              onClick={() => setIsOpen(false)}
            />
            <NavItem
              to="/favorites"
              label="Favorites"
              mobile
              onClick={() => setIsOpen(false)}
            />
            <NavItem
              to="/quiz"
              label="Quiz"
              mobile
              onClick={() => setIsOpen(false)}
            />
            {isAuthenticated ? (
              <>
                <NavItem
                  to="/profile"
                  label="View Profile"
                  mobile
                  onClick={() => setIsOpen(false)}
                />
                <NavItem
                  to="/quiz-results"
                  label="View Quiz Results"
                  mobile
                  onClick={() => setIsOpen(false)}
                />
                {/* <NavItem
                  to="/passport"
                  label="View Passport"
                  mobile
                  onClick={() => setIsOpen(false)}
                /> */}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full bg-purple-800 text-white py-2 rounded-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block w-full text-center bg-purple-600 text-white py-2 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                Join Now
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const NavItem = ({ to, label, mobile, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={
      mobile
        ? "block text-white text-center py-2 rounded-lg hover:bg-indigo-800"
        : "text-white hover:text-indigo-300 font-medium text-base"
    }
  >
    {label}
  </Link>
);

export default Navbar;
