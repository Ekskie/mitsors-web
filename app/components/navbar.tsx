'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { Menu, X, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="px-2 sm:px-3">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Left: Logo + Brand Name + Navigation */}
          <div className="flex items-center gap-6 ml-3">
            {/* Logo & Brand */}
            <Link 
              href="/" 
              className="flex items-center gap-2 font-bold text-lg shrink-0 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <Image
                src="/mitsors_logo.png"
                alt="MITSORS Logo"
                width={38}
                height={38}
                className="h-10 w-10 rounded-lg"
              />
              <span className="hidden sm:inline">MITSORS</span>
            </Link>

            {/* Navigation Items (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-base font-medium transition-colors whitespace-nowrap',
                    isActive(item.href)
                      ? 'text-emerald-600'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-0 shrink-0">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Login Button */}
            <Button
              variant="ghost"
              size="default"
              className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 px-4 py-2 gap-2 mr-3"
              title="Login"
            >
              <LogIn className="h-6 w-6" />

            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
