import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';

interface MetadataResult {
  filename: string;
  title: string;
  keywords: string;
  category: number;
  releases: string;
}

const defaultCategory = 8;

/**
 * Generates metadata for a single filename
 */
async function generateMetadataForFile(filename: string, apiKey: string): Promise<MetadataResult> {
  const openai = new OpenAI({
    apiKey: apiKey,
  });
  // Create title and keywords requests in parallel
  const [titleResp, kwResp] = await Promise.all([
    // Title generation
    openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are an expert AI assistant that generates short, SEO-friendly titles for stock icons. Respond with ONLY the title text, no quotes or additional formatting." 
        },
        { 
          role: "user", 
          content: `Create a stock image title for an icon with these rules:
- Write in English
- Maximum 200 characters
- Do not include numbers from the filename
- Short description of what the asset represents
- Do not include words: "icon", "symbol", quotes
- Example: Minimalist navigation controls and interactive elements for modern apps and websites

Filename: ${filename}

Respond with ONLY the title:` 
        },
      ],
      temperature: 0,
      max_tokens: 100,
    }),

    // Keywords generation
    openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are an AI assistant that creates keyword lists. Respond with ONLY a comma-separated list of keywords, no additional text." 
        },
        { 
          role: "user", 
          content: `Create keywords for a stock icon with these rules:
- Write in English
- Most important keywords first
- Maximum 49 keywords
- All lowercase
- Separate with commas only
- No repeated words
- No generic words: vector, illustration, design, modern, professional, art, aesthetic, digital
- Focus on meaning and function
- Example: expand, arrow, enlarge, fullscreen, maximize, resize, interface, ui, ux, button

Filename: ${filename}

Respond with ONLY comma-separated keywords:` 
        },
      ],
      temperature: 0,
      max_tokens: 200,
    }),

  ]);

  // Process title
  const title = (titleResp.choices?.[0]?.message?.content || "")
    .trim()
    .replace(/["']/g, "")
    .slice(0, 200);

  // Process keywords
  const keywordsRaw = kwResp.choices?.[0]?.message?.content || "";
  const keywords = keywordsRaw
    .toLowerCase()
    .replace(/\d+/g, "") // Remove numbers
    .replace(/[^a-z,\s]/g, "") // Keep only letters, commas, and spaces
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0 && k.length < 30) // Filter out empty and overly long keywords
    .slice(0, 49)
    .join(", ");

  // Now get category with processed keywords
  const categoryResp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { 
        role: "system", 
        content: "You categorize stock icons into Adobe Stock categories. Respond with ONLY a single number from 1-21, no additional text." 
      },
      { 
        role: "user", 
        content: `Determine the Adobe Stock category (1-21) for this icon:

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

Respond with ONLY the number (1-21):` 
      }
    ],
    temperature: 0,
    max_tokens: 5,
  });
  
  // Process category with strict validation
  const categoryResponse = categoryResp.choices?.[0]?.message?.content?.trim() || "";
  const categoryMatch = categoryResponse.match(/\b([1-9]|1[0-9]|2[01])\b/);
  const cat = categoryMatch ? parseInt(categoryMatch[1]) : defaultCategory;
  
  // Final validation
  const finalCategory = (cat >= 1 && cat <= 21) ? cat : defaultCategory;

  return { 
    filename, 
    title, 
    keywords, 
    category: finalCategory, 
    releases: "" 
  };
}

export async function POST(request: NextRequest) {
  try {
    const { filenames } = await request.json();
    const apiKey = request.headers.get('x-openai-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is required. Please set it in Settings." },
        { status: 401 }
      );
    }

    if (!filenames || !Array.isArray(filenames)) {
      return NextResponse.json(
        { error: "Invalid filenames array" },
        { status: 400 }
      );
    }

    if (filenames.length === 0) {
      return NextResponse.json(
        { error: "Filenames array cannot be empty" },
        { status: 400 }
      );
    }

    // Process all filenames in parallel for better performance
    const results: MetadataResult[] = await Promise.all(
      filenames.map((filename: string) => generateMetadataForFile(filename, apiKey))
    );

    return NextResponse.json({ data: results });
  } catch (e: unknown) {
    console.error("Metadata generation error:", e);
    const errorMessage = e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}