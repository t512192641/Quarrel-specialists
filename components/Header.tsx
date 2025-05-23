"use client";

import { useState, useEffect } from "react";
import { MoveUpRight, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="py-6 md:py-10 w-full">
      <div className="container flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 animate-gradient">
            吵架包赢
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-md">
            用天津话绝杀对手，轻松获胜！
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      <div className="container mt-4 p-4 bg-secondary/50 rounded-lg border border-primary/10 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MoveUpRight className="h-4 w-4" />
          <p>输入对方的话，选择愤怒值，让AI用天津话帮你反击！</p>
        </div>
      </div>
    </header>
  );
}