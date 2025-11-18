// Utility functions for creating ASCII-style boxes with double-line borders

export function createASCIIBox(
  content: string,
  width?: number,
  openRight: boolean = false
): string {
  const lines = content.split("\n");
  const maxWidth = width || Math.max(...lines.map((line) => line.length));
  const paddedLines = lines.map((line) => line.padEnd(maxWidth));

  if (openRight) {
    // Open bracket style on the right
    const top = `╔${"═".repeat(maxWidth + 2)}╗`;
    const middle = paddedLines
      .map((line) => `║ ${line} ║`)
      .join("\n");
    const bottom = `╚${"═".repeat(maxWidth + 2)}╝`;
    return `${top}\n${middle}\n${bottom}`;
  } else {
    // Closed box
    const top = `╔${"═".repeat(maxWidth + 2)}╗`;
    const middle = paddedLines
      .map((line) => `║ ${line} ║`)
      .join("\n");
    const bottom = `╚${"═".repeat(maxWidth + 2)}╝`;
    return `${top}\n${middle}\n${bottom}`;
  }
}

// Create a horizontal box with open bracket on right (for list items)
export function createASCIIListItem(text: string, width: number = 20): string {
  const paddedText = text.padEnd(width);
  return `╔${"═".repeat(width + 2)}╗\n║ ${paddedText} ║\n╚${"═".repeat(width + 2)}╝`;
}

// Simple inline box style (for cards)
export function createInlineASCIIBox(
  text: string,
  separator: string = " ||"
): string {
  return `╔${"═".repeat(text.length + separator.length + 2)}╗\n║ ${text}${separator} ║\n╚${"═".repeat(text.length + separator.length + 2)}╝`;
}

