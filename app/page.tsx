"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import ArgumentForm from "@/components/ArgumentForm";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  // Initialize local storage on client side
  useEffect(() => {
    // Initialize history if it doesn't exist
    if (typeof window !== "undefined" && !localStorage.getItem("argumentHistory")) {
      localStorage.setItem("argumentHistory", JSON.stringify([]));
    }
  }, []);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Header />
          <ArgumentForm />
          <Footer />
        </div>
      </main>
      <Toaster />
    </>
  );
}