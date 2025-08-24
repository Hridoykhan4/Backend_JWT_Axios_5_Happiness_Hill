import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuthValue from "../hooks/useAuthValue";
import toast from "react-hot-toast";

/* Icons Start */
const MenuIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const MountainIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);

const SunIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);
const MoonIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);
/* Icons End */

const Navbar = () => {
  const nav = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user, theme, setTheme, logOut } = useAuthValue();

  /* Theme SetUp */
  useEffect(() => {
    const root = document.documentElement;
    if (theme) {
      root.classList.add("dark");
      localStorage.setItem("hotel-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("hotel-theme", "light");
    }
  }, [theme]);
  /* Theme SetUp */

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Rooms", to: "/all-rooms" },
    { label: "About", to: "/about" },
  ];

  const avatarDropdownLinks = [{ label: "Profile", to: "/my-profile" }];

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleSignOut = async () => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white dark:bg-gray-900 shadow-lg rounded-xl pointer-events-auto flex flex-col p-4`}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Confirm Logout
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to log out?
        </p>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 rounded-lg text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              logOut().then(() => {
                nav("/");
                toast.success("Successfully Log out");
              });
            }}
            className="px-4 py-2 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </button>
        </div>
      </div>
    ));
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 sm:px-0">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <MountainIcon className="h-6 w-6 text-gray-900 dark:text-gray-100" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Hotel Happiness Hill
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(!theme)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme ? <SunIcon></SunIcon> : <MoonIcon className="h-5 w-5" />}
            </button>

            {/* Avatar */}
            {user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => toggleDropdown("avatar")}
                  className="flex items-center gap-2 focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === "avatar"}
                >
                  {user && (
                    <img
                      title={user?.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      src={user?.photoURL}
                    ></img>
                  )}
                </button>
                {openDropdown === "avatar" && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in"
                    role="menu"
                  >
                    {user?.email === "hridoykhan148385@gmail.com" && (
                      <>
                        <NavLink
                          to={"/add-room"}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          Add Room (Admin)
                        </NavLink>

                        <NavLink
                          to={"/my-posts"}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          My Rooms (Admin)
                        </NavLink>
                        <NavLink
                          to={"/dashboard"}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          My Dashboard
                        </NavLink>
                      </>
                    )}

                    {user?.email !== "hridoykhan148385@gmail.com" && (
                      <>
                        <NavLink
                          to={"/my-booking-rooms"}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          My Bookings
                        </NavLink>
                      </>
                    )}

                    {avatarDropdownLinks.map((item) => (
                      <NavLink
                        key={item.label}
                        to={item.to}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {item.label}
                      </NavLink>
                    ))}
                    <button
                      onClick={handleSignOut}
                      className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="
                  inline-block
                  px-6 py-2
                  font-medium
                  rounded-lg
                  text-gray-50 dark:text-gray-900
                  bg-gray-900 dark:bg-gray-50
                  hover:bg-gray-700 dark:hover:bg-gray-200
                  transition
                  duration-300
                  transform
                  hover:scale-105
                  shadow-md
                  hover:shadow-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-gray-400 dark:focus:ring-gray-500
                "
                >
                  Login
                </Link>
              </>
            )}

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-4 py-3 space-y-2 animate-slide-down">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2"
            >
              {link.label}
            </NavLink>
          ))}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            {avatarDropdownLinks.map((item) => (
              <>
                {user && (
                  <div className="flex justify-end">
                    <img
                      title={user?.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      src={user?.photoURL}
                    ></img>
                  </div>
                )}
                <Link
                  key={item.label}
                  to={item.to}
                  className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {item.label}
                </Link>

                {user?.email === "hridoykhan148385@gmail.com" && (
                  <>
                    <NavLink
                      to={"/add-room"}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Add Room (Admin)
                    </NavLink>

                    <NavLink
                      to={"/my-posts"}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      My Rooms (Admin)
                    </NavLink>
                    <NavLink
                      to={"/dashboard"}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      My Dashboard
                    </NavLink>
                  </>
                )}

                {user?.email !== "hridoykhan148385@gmail.com" && (
                  <>
                    <NavLink
                      to={"/my-booking-rooms"}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      My Bookings
                    </NavLink>
                  </>
                )}
                <button
                  onClick={handleSignOut}
                  className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Log out
                </button>
              </>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
