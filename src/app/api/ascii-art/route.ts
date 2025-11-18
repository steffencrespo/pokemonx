import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, font = "Standard" } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Use dynamic import for better Next.js compatibility
    let figlet: any;
    try {
      // Try ESM import first
      const figletModule = await import("figlet");
      figlet = figletModule.default || figletModule;
    } catch (importError) {
      // Fallback to require for CommonJS
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      figlet = require("figlet");
    }

    if (!figlet || typeof figlet.text !== "function") {
      return NextResponse.json(
        { error: "Failed to load figlet library" },
        { status: 500 }
      );
    }

    return new Promise((resolve) => {
      try {
        // Use a safe font that definitely exists
        const safeFont = font || "Standard";
        figlet.text(text, { font: safeFont }, (err: Error | null, data?: string) => {
          if (err) {
            console.error("Figlet error:", err);
            // Try with default font if custom font fails
            if (font !== "Standard") {
              figlet.text(text, { font: "Standard" }, (err2: Error | null, data2?: string) => {
                if (err2) {
                  resolve(
                    NextResponse.json(
                      { error: "Failed to generate ASCII art", details: err2.message },
                      { status: 500 }
                    )
                  );
                } else {
                  resolve(NextResponse.json({ ascii: data2 || text }));
                }
              });
            } else {
              resolve(
                NextResponse.json(
                  { error: "Failed to generate ASCII art", details: err.message },
                  { status: 500 }
                )
              );
            }
          } else {
            resolve(NextResponse.json({ ascii: data || text }));
          }
        });
      } catch (syncError) {
        console.error("Sync error in figlet:", syncError);
        resolve(
          NextResponse.json(
            { 
              error: "Failed to generate ASCII art",
              details: syncError instanceof Error ? syncError.message : "Unknown error"
            },
            { status: 500 }
          )
        );
      }
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

