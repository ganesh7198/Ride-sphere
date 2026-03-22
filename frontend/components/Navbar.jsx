import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_PATHS, BASE_URL } from "../utils/Apipath";
import { HiChevronDown, HiLogout, HiUser, HiCog } from "react-icons/hi";

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}${API_PATHS.AUTH.LOGOUT}`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: BRAND */}
          <Link to="/home" className="flex items-center group">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              <span className="text-gray-800">Ride</span>
              <span className="text-red-500 group-hover:text-red-600 transition-colors">
                Sphere
              </span>
            </h1>
          </Link>
          {/* RIGHT: PROFILE DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 focus:outline-none group cursor-pointer"
            >
              <div className="relative">
                <img
                  src={
                    user?.profileImg ||
                    "https://api.dicebear.com/7.x/initials/svg?seed=User"
                  }
                  alt="profile"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-green-600 transition-all duration-200"
                />
              </div>
              <HiChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* DROPDOWN MENU */}
            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-slideDown">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        user?.profileImg ||
                        "https://api.dicebear.com/7.x/initials/svg?seed=User"
                      }
                      alt="profile"
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user?.fullname || user?.username || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/home/Myprofile");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <HiUser size={18} className="text-gray-500" />
                    <span>My Profile</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="my-1 border-t border-gray-100"></div>

                {/* Logout Button */}
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <HiLogout size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
