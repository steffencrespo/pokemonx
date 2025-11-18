// Utility for converting text to ASCII art using API route

export async function textToASCIIArt(
  text: string,
  font: string = "Standard"
): Promise<string> {
  try {
    const response = await fetch("/api/ascii-art", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, font }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate ASCII art");
    }

    const data = await response.json();
    return data.ascii || text;
  } catch (error) {
    console.warn("Failed to generate ASCII art, using plain text:", error);
    return text;
  }
}

// Simple fallback ASCII art (always works, no API call)
export function textToASCIISimple(text: string): string {
  const upperText = text.toUpperCase();
  const border = "═".repeat(Math.max(upperText.length + 4, 20));
  return `╔${border}╗\n║  ${upperText.padEnd(Math.max(upperText.length, 16))}  ║\n╚${border}╝`;
}
