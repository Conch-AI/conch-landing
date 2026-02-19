import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function extractPdfText(buffer: Buffer): Promise<string> {
  // pdf-parse is a CommonJS module, use require for better compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(buffer);
  return data.text;
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const mammothModule = await import("mammoth");
  const mammoth = mammothModule.default || mammothModule;
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function extractPptxText(buffer: Buffer): Promise<string> {
  const jszipModule = await import("jszip");
  const JSZip = jszipModule.default || jszipModule;
  const zip = await JSZip.loadAsync(buffer);
  const texts: string[] = [];

  const slideFiles = Object.keys(zip.files)
    .filter((name: string) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort();

  for (const slideFile of slideFiles) {
    const xml = await zip.files[slideFile].async("text");
    // Extract text content from XML tags like <a:t>text</a:t>
    const matches = xml.match(/<a:t>([^<]*)<\/a:t>/g);
    if (matches) {
      const slideTexts = matches.map((m: string) => m.replace(/<\/?a:t>/g, ""));
      texts.push(slideTexts.join(" "));
    }
  }

  return texts.join("\n\n");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = "";

    if (fileName.endsWith(".pdf")) {
      text = await extractPdfText(buffer);
    } else if (fileName.endsWith(".docx")) {
      text = await extractDocxText(buffer);
    } else if (fileName.endsWith(".pptx")) {
      text = await extractPptxText(buffer);
    } else if (fileName.endsWith(".doc")) {
      return NextResponse.json(
        {
          error:
            "Legacy .doc format is not supported. Please convert to .docx and try again.",
        },
        { status: 400 }
      );
    } else if (fileName.endsWith(".ppt")) {
      return NextResponse.json(
        {
          error:
            "Legacy .ppt format is not supported. Please convert to .pptx and try again.",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: "Unsupported file format. Please upload PDF, DOCX, or PPTX." },
        { status: 400 }
      );
    }

    if (!text.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from this file. It may be image-based or empty." },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: text.trim(), fileName: file.name });
  } catch (error) {
    console.error("File parse error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to parse file: ${message}` },
      { status: 500 }
    );
  }
}
