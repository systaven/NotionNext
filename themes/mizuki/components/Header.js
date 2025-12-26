
import React, { useState } from 'react';
import Link from 'next/link';
import CONFIG from '../config';

/**
 * 网站顶部导航栏
 * @param {{ navs: object[], ...props }} props
 * @returns {JSX.Element}
 */
const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="w-full bg-white dark:bg-black shadow-md fixed-top">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" passHref>
          <a className="text-2xl font-bold dark:text-white">{CONFIG.MIZUKI_NAV_TITLE}</a>
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-800 dark:text-gray-200 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex space-x-4">
          {CONFIG.MIZUKI_MENU_LINKS.map(link => (
            <Link key={link.path} href={link.path} passHref>
              <a className="text-gray-800 dark:text-gray-200 hover:text-blue-500">{link.name}</a>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu (collapsible) */}
      {isOpen && (
        <nav className="lg:hidden p-4">
          {CONFIG.MIZUKI_MENU_LINKS.map(link => (
            <Link key={link.path} href={link.path} passHref>
              <a className="block text-gray-800 dark:text-gray-200 py-2 hover:text-blue-500">{link.name}</a>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
