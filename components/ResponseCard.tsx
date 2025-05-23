"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CopyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ResponseCardProps {
  response: string;
  index: number;
  angerLevel: number;
}

export default function ResponseCard({ response, index, angerLevel }: ResponseCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get card color based on anger level
  const getCardColor = () => {
    const baseClasses = "border-2 transition-all duration-300 hover:shadow-lg";
    
    if (angerLevel <= 3) {
      return cn(baseClasses, "border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800");
    }
    if (angerLevel <= 6) {
      return cn(baseClasses, "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800");
    }
    if (angerLevel <= 8) {
      return cn(baseClasses, "border-orange-300 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800");
    }
    return cn(baseClasses, "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.15 }}
    >
      <Card className={getCardColor()}>
        <CardContent className="p-4 relative">
          <p className="text-base whitespace-pre-line">{response}</p>
          
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            title="复制文本"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <CopyIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}