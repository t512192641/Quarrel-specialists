"use client";

import { GithubIcon, HeartIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-primary/10">
      <div className="container flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} 吵架包赢 - 用AI智能吵架，轻松获胜！
        </p>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            隐私政策
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            使用条款
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <HeartIcon className="h-3 w-3" />
            <span>支持我们</span>
          </a>
        </div>
      </div>
    </footer>
  );
}