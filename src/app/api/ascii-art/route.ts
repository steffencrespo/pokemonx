import { NextRequest, NextResponse } from "next/server";

async function loadFiglet() {
  try {
    const figletModule = await import("figlet");
    return figletModule.default || figletModule;
  } catch {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("figlet");
  }
}

type FigletModule = Awaited<ReturnType<typeof loadFiglet>>;

function generateAscii(
  figlet: FigletModule,
  text: string,
  font: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    figlet.text(text, { font }, (err: Error | null, data?: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(data || text);
      }
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    const { text, font = "Standard" } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const figlet = await loadFiglet();

    if (!figlet || typeof figlet.text !== "function") {
      return NextResponse.json(
        { error: "Failed to load figlet library" },
        { status: 500 }
      );
    }

    try {
      const ascii = await generateAscii(figlet, text, font);
      return NextResponse.json({ ascii });
    } catch (primaryError) {
      console.error("Figlet error:", primaryError);

      if (font !== "Standard") {
        try {
          const fallbackAscii = await generateAscii(figlet, text, "Standard");
          return NextResponse.json({ ascii: fallbackAscii });
        } catch (fallbackError) {
          console.error("Figlet fallback error:", fallbackError);
        }
      }

      return NextResponse.json(
        {
          error: "Failed to generate ASCII art",
          details:
            primaryError instanceof Error ? primaryError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

