import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBagIcon,
  UserIcon,
  LogOutIcon,
  LayoutDashboardIcon,
  ChevronDownIcon,
  PackageIcon } from
'lucide-react';
import { useCart, useAuth } from '../App';
import { StudioSelectBar } from './studio/StudioSelectBar';
import { useStore } from '../context/StoreContext';
import { useVisitorSite } from '../hooks/useVisitorSite';
import logo from './logo.jpeg';
const HERO_IMAGE = logo ;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  const { announcementLine } = useStore();
  const site = useVisitorSite();
  const navVisible = site.nav.filter((l) => l.visible);
  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) {
    return null;
  }
  return (
    <>
      {/* ── Announcement Bar ── */}
      <div className="relative w-full bg-black py-2 px-6 text-center">
        <StudioSelectBar
          panel="settings"
          label="Top bar"
          block="announcement"
          anchor="above"
        />
        <p className="font-mono text-xs text-white uppercase tracking-widest">
          {announcementLine}
        </p>
      </div>

      {/* ── Main Header ── */}
      <header
        className="relative sticky top-0 z-50 border-b border-white/20"
        style={{
          backgroundColor: 'var(--primary)'
        }}>

        <StudioSelectBar
          panel="navigation"
          label="Menus"
          block="header-nav"
          anchor="above"
        />
        <div className="flex items-center justify-between px-6 py-3 max-w-screen-2xl mx-auto">
          {/* Logo: oil image + GLOW text */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            aria-label="GLOW Home">

            <img
              src={
                site.identity.logoUrl?.trim().length > 0
                  ? site.identity.logoUrl
                  : HERO_IMAGE
              }
              alt="GLOW Logo"
              className="w-10 h-10 rounded-full object-cover border-2 border-white/40" />

            <span className="font-anton text-2xl text-white leading-none tracking-tight">
              {site.identity.brandWord}
              <span
                style={{
                  color: 'var(--red)'
                }}>

                {site.identity.brandAccent}
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation">

            {navVisible.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.id}
                  to={link.href}
                  className={`font-mono text-sm uppercase tracking-widest relative pb-1 transition-colors ${isActive ? 'text-white' : 'text-white/70 hover:text-white'}`}>

                  {link.label}
                  {isActive &&
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />

                  }
                </Link>);

            })}
          </nav>

          {/* Right: Auth + Cart */}
          <div className="hidden md:flex items-center gap-5">
            {/* Auth */}
            {user ?
            <div className="relative">
                <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 group"
                aria-label="Profile menu">

                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/40 group-hover:border-white transition-colors flex items-center justify-center bg-white/20">
                    {user.avatar ?
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover" /> :


                  <span className="font-mono text-xs text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                  }
                  </div>
                  <span className="font-mono text-xs text-white/80 uppercase tracking-widest hidden lg:block">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDownIcon className="w-3 h-3 text-white/60" />
                </button>

                <AnimatePresence>
                  {profileOpen &&
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                    scale: 0.95
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.95
                  }}
                  transition={{
                    duration: 0.15
                  }}
                  className="absolute right-0 top-full mt-2 w-52 rounded-lg shadow-xl overflow-hidden z-50"
                  style={{
                    backgroundColor: '#7a0449'
                  }}>

                      <div className="p-3 border-b border-white/10">
                        <p className="font-mono text-xs text-white font-bold truncate">
                          {user.name}
                        </p>
                        <p className="font-mono text-xs text-white/50 truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/dashboard');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 font-mono text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors">

                        <LayoutDashboardIcon className="w-3.5 h-3.5" />
                        MY DASHBOARD
                      </button>
                      <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/cart');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 font-mono text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors">

                        <PackageIcon className="w-3.5 h-3.5" />
                        MY ORDERS
                      </button>
                      <button
                    onClick={() => {
                      signOut();
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 font-mono text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors">

                        <LogOutIcon className="w-3.5 h-3.5" />
                        SIGN OUT
                      </button>
                    </motion.div>
                }
                </AnimatePresence>
              </div> :

            <Link
              to="/signin"
              className="font-mono text-sm uppercase tracking-widest text-white/80 hover:text-white transition-colors flex items-center gap-1.5">

                <UserIcon className="w-4 h-4" />
                SIGN IN
              </Link>
            }

            {/* Cart — navigates to /cart page */}
            <Link
              to="/cart"
              className="relative"
              aria-label={`Cart with ${cartCount} items`}>

              <ShoppingBagIcon className="w-6 h-6 text-white" />
              {cartCount > 0 &&
              <motion.span
                initial={{
                  scale: 0
                }}
                animate={{
                  scale: 1
                }}
                className="absolute -top-2 -right-2 text-white text-xs font-mono w-5 h-5 rounded-full flex items-center justify-center font-bold"
                style={{
                  backgroundColor: '#FF0000'
                }}>

                  {cartCount}
                </motion.span>
              }
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 z-50 relative"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}>

            <motion.span
              animate={
              menuOpen ?
              {
                rotate: 45,
                y: 8
              } :
              {
                rotate: 0,
                y: 0
              }
              }
              transition={{
                duration: 0.3
              }}
              className="block w-7 h-0.5 bg-white origin-center" />

            <motion.span
              animate={
              menuOpen ?
              {
                opacity: 0,
                scaleX: 0
              } :
              {
                opacity: 1,
                scaleX: 1
              }
              }
              transition={{
                duration: 0.2
              }}
              className="block w-7 h-0.5 bg-white" />

            <motion.span
              animate={
              menuOpen ?
              {
                rotate: -45,
                y: -8
              } :
              {
                rotate: 0,
                y: 0
              }
              }
              transition={{
                duration: 0.3
              }}
              className="block w-7 h-0.5 bg-white origin-center" />

          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {menuOpen &&
        <motion.div
          initial={{
            y: '-100%'
          }}
          animate={{
            y: 0
          }}
          exit={{
            y: '-100%'
          }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center"
          style={{
            backgroundColor: '#7a0449'
          }}>

            <nav className="flex flex-col items-center gap-8">
              {navVisible.map((link, i) =>
            <motion.div
              key={link.id}
              initial={{
                opacity: 0,
                y: 40
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: 40
              }}
              transition={{
                delay: 0.1 + i * 0.08,
                duration: 0.4
              }}>

                  <Link
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-anton text-6xl text-white hover:opacity-70 transition-opacity uppercase">

                    {link.label}
                  </Link>
                </motion.div>
            )}
              <motion.div
              initial={{
                opacity: 0,
                y: 40
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: 40
              }}
              transition={{
                delay: 0.5,
                duration: 0.4
              }}
              className="flex flex-col items-center gap-4">

                <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="font-mono text-sm text-white/60 hover:text-white transition-colors uppercase tracking-widest">

                  CART ({cartCount})
                </Link>
                {user ?
              <button
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="font-mono text-sm text-white/60 hover:text-white transition-colors uppercase tracking-widest">

                    SIGN OUT
                  </button> :

              <Link
                to="/signin"
                onClick={() => setMenuOpen(false)}
                className="font-mono text-sm text-white/60 hover:text-white transition-colors uppercase tracking-widest">

                    SIGN IN
                  </Link>
              }
              </motion.div>
            </nav>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}