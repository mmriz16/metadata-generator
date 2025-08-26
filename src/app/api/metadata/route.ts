import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";

interface MetadataResult {
  filename: string;
  title: string;
  keywords: string;
  category: number;
  releases: string;
}

const defaultCategory = 8;

export async function POST(request: NextRequest) {
  try {
    const { filenames } = await request.json();

    if (!filenames || !Array.isArray(filenames)) {
      return NextResponse.json(
        { error: "Invalid filenames array" },
        { status: 400 }
      );
    }

    const results: MetadataResult[] = [];

    for (const filename of filenames) {
      // Title
      const titleResp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert AI assistant that generates short, SEO-friendly titles for stock icons. Your task is to create a title based on a given filename." },
          { role: "user", content: `Create a very short stock image title for an icon with the following rules:
                                    - Write in English
                                    - Maximum 200 characters
                                    - Do not include numbers from the filename
                                    - A short description of what the asset represents
                                    - Do not include the word "icon" or "symbol"
                                    - Do not include double quote symbol
                                    - Do not include single quote symbol
                                    - Example : Minimalist icons for UIUX, featuring navigation, controls, and interactive elements. Ideal for modern apps and websites	
                                    Filename: ${filename}
          ` },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });
      const title = (titleResp.choices?.[0]?.message?.content || "").slice(0, 200);

      // Keywords
      const kwResp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an AI assistant who helps create metadata." },
          { role: "user", content: `Create a list of keywords for a stock icon with the following rules:
                                    - Write in English
                                    - Most important keywords first
                                    - Most related keywords to filename first
                                    - Maximum 49 keywords
                                    - All lowercase
                                    - Separate with commas
                                    - Do not repeat words
                                    - Do not include generic words like: vector, illustration, design, modern, professional, art, aesthetic, digital
                                    - Focus only on the meaning and function of the icon
                                    - Example for "Expand Icon": expand, arrow, enlarge, fullscreen, maximize, resize, interface, ui, ux, button, zoom, navigation, symbol, direction, screen
                                    Filename: ${filename}
          ` },
        ],
        temperature: 0.7,
        max_tokens: 400,
      });
      const keywordsRaw = kwResp.choices?.[0]?.message?.content || "";
      const keywords = keywordsRaw
        .replace(/\d+/g, "")
        .split(/,|\n|\r/)
        .map((k) => k.trim())
        .filter(Boolean)
        .slice(0, 49)
        .join(", ");

      // AI-powered category determination
      const categoryResp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an AI assistant that categorizes stock icons into Adobe Stock categories. You must respond with ONLY a number from 1-21." },
          { role: "user", content: `Determine the most appropriate Adobe Stock category (1-21) for this icon:

Filename: ${filename}
Keywords: ${keywords}

Categories:
1. Animals
2. Buildings and Architecture
3. Business
4. Drinks
5. The Environment
6. States of Mind
7. Food
8. Graphic Resources
9. Hobbies and Leisure
10. Industry
11. Landscapes
12. Lifestyle
13. People
14. Plants and Flowers
15. Culture and Religion
16. Science
17. Social Issues
18. Sports
19. Technology
20. Transport
21. Travel

Respond with ONLY the category number (1-21):` }
        ],
        temperature: 0.3,
        max_tokens: 10,
      });
      
      const categoryResponse = categoryResp.choices?.[0]?.message?.content?.trim() || "";
      let cat = parseInt(categoryResponse) || defaultCategory;
      
      // Ensure category is within valid range
      if (cat < 1 || cat > 21) {
        cat = defaultCategory;
      }

      results.push({ filename, title, keywords, category: cat, releases: "" });
    }

    return NextResponse.json({ data: results });
  } catch (e: unknown) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}