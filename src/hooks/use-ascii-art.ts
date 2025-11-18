"use client";

import { useState, useEffect } from "react";
import { textToASCIIArt, textToASCIISimple } from "@/lib/ascii-art";

export function useASCIIArt(text: string, enabled: boolean = true) {
  const [asciiText, setAsciiText] = useState<string>(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !text) {
      setAsciiText(text);
      return;
    }

    // For short text or simple cases, use simple ASCII
    if (text.length <= 10) {
      setIsLoading(true);
      textToASCIIArt(text, "Standard")
        .then((result) => {
          setAsciiText(result);
          setIsLoading(false);
        })
        .catch(() => {
          // Fallback to simple ASCII
          setAsciiText(textToASCIISimple(text));
          setIsLoading(false);
        });
    } else {
      // For longer text, use simple version to avoid large ASCII art
      setAsciiText(textToASCIISimple(text));
    }
  }, [text, enabled]);

  return { asciiText, isLoading };
}

