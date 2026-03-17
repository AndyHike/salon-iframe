'use client';

import { useEffect } from 'react';

export function FontLoader({ fontFamily }: { fontFamily: string }) {
  useEffect(() => {
    if (!fontFamily) return;

    // Extract the primary font name (e.g., "'Inter', sans-serif" -> "Inter")
    const match = fontFamily.match(/['"]?([^'",]+)['"]?/);
    if (!match || !match[1]) return;

    const fontName = match[1].trim();
    
    // Skip generic system fonts
    const systemFonts = ['sans-serif', 'serif', 'monospace', 'system-ui', 'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'];
    if (systemFonts.includes(fontName)) return;

    // Check if the font is already loaded
    const fontId = `google-font-${fontName.replace(/\s+/g, '-')}`;
    if (document.getElementById(fontId)) return;

    // Create and append the link tag
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
    document.head.appendChild(link);

  }, [fontFamily]);

  return null;
}
