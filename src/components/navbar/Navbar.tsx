import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiLoginCircleFill, RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import ThemeSwitch from '../theme-switch/ThemeSwitch';
import { useAuth } from '../../store/auth-context/AuthContext';

const Navbar = () => {
  const { user, SignOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-4 lg:px-8 bg-light shadow-sm dark:shadow-dark-bg dark:bg-dark py-4 text-darkgray dark:text-light">
      {/* Logo Section */}
      <div className="flex items-center">
        <Link to="/">
          <img
            className="h-[50px]"
            src="/images/HorizonVIewLog.jpeg"
            alt="HorizonView Admin"
          />
        </Link>
      </div>

      {/* Hamburger Menu Button for Mobile */}
      <button
        className="lg:hidden text-2xl"
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? <RiCloseLine /> : <RiMenu3Line />}
      </button>

      {/* Links Section (Desktop & Mobile) */}
      <div
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } absolute top-[70px] left-0 w-full lg:w-auto lg:static lg:flex lg:items-center lg:space-x-4 bg-light dark:bg-dark lg:bg-transparent`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 mt-4 lg:mt-0">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'text-warning font-light'
                : 'text-darkgray dark:text-light font-light'
            }
            to="/"
          >
            Home
          </NavLink>
          {user && (
            <>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'text-warning font-light'
                    : 'text-darkgray dark:text-light font-light'
                }
                to="/dashboard"
              >
                Dashboard
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'text-warning font-light'
                    : 'text-darkgray dark:text-light font-light'
                }
                to="/employeeManagement"
              >
                Add Team
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'text-warning font-light'
                    : 'text-darkgray dark:text-light font-light'
                }
                to="/allemp"
              >
                Employee
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'text-warning font-light'
                    : 'text-darkgray dark:text-light font-light'
                }
                to="/allapplication"
              >
                Application
              </NavLink>
            </>
          )}
        </div>

        <div className="mt-4 lg:mt-0 lg:ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu((value) => !value)}
                className="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-8 h-8 rounded-full"
                  src={user.photoURL ? user.photoURL : '/images/user.webp'}
                  alt={user.displayName || 'User'}
                />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-light dark:bg-darkgray rounded-lg shadow-lg">
                  <div className="px-4 py-3">
                    <p className="text-sm text-darkgray dark:text-light">
                      {user.displayName || 'Bonnie Green'}
                    </p>
                    <p className="text-sm font-medium text-darkbg dark:text-lightgray">
                      {user.email}
                    </p>
                  </div>
                  <ul className="py-2">
                    <li>
                      <Link
                        to="/"
                        className="block px-4 py-2 text-sm hover:bg-primary dark:hover:bg-gray-700"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-sm hover:bg-primary dark:hover:bg-gray-700"
                      >
                        Create Admin
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={SignOut}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-primary dark:hover:bg-gray-700"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              className="bg-primary text-light px-4 py-2 rounded hover:bg-secondary"
            >
              Sign In <RiLoginCircleFill className="ml-1 inline" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
