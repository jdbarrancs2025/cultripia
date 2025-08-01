"use client";

import {
  UserButton,
  SignInButton,
  useUser as useClerkUser,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";
import Image from "next/image";

export function Navigation() {
  const { isSignedIn } = useClerkUser();
  const { user, role } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("navigation");
  const tCommon = useTranslations("common");

  const getNavigationItems = () => {
    const items = [{ label: t("explore"), href: "/experiences", show: true }];

    if (!isSignedIn) {
      return items;
    }

    // Traveler navigation
    if (role === "traveler") {
      items.push(
        { label: t("myBookings"), href: "/dashboard", show: true },
        { label: t("becomeHost"), href: "/become-a-host", show: true },
      );
    }

    // Host navigation
    if (role === "host") {
      items.push(
        { label: t("dashboard"), href: "/host/dashboard", show: true },
        { label: t("myExperiences"), href: "/host/experiences", show: true },
        { label: t("calendar"), href: "/host/calendar", show: true },
        { label: t("myBookings"), href: "/dashboard", show: true },
      );
    }

    // Admin navigation
    if (role === "admin") {
      items.push(
        { label: t("adminDashboard"), href: "/admin", show: true },
        { label: t("dashboard"), href: "/host/dashboard", show: true },
        { label: t("myExperiences"), href: "/host/experiences", show: true },
        { label: t("calendar"), href: "/host/calendar", show: true },
        { label: t("myBookings"), href: "/dashboard", show: true },
      );
    }

    return items.filter((item) => item.show);
  };

  const navItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/images/cultripia-logo.png"
              alt="Cultripia"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
            <span className="text-2xl font-bold text-[#009D9B]">Cultripia</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[#4F4F4F] hover:text-[#009D9B] transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <SignInButton mode="modal">
                  <Button className="bg-[#009D9B] hover:bg-[#008C8A]">
                    {tCommon("signIn")}
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#4F4F4F] hover:text-[#009D9B] p-2"
              aria-label={mobileMenuOpen ? tCommon("closeMenu") : tCommon("openMenu")}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[#4F4F4F] hover:text-[#009D9B] transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Language Switcher */}
              <div className="px-2 py-2">
                <LanguageSwitcher />
              </div>

              {/* Mobile Auth */}
              <div className="pt-4 border-t">
                {isSignedIn ? (
                  <div className="px-2">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    <Button className="bg-[#009D9B] hover:bg-[#008C8A] w-full">
                      {tCommon("signIn")}
                    </Button>
                  </SignInButton>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
