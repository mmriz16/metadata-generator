import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';

interface ShutterstockResult {
  filename: string;
  description: string;
  keywords: string;
  categories: string;
  editorial: string;
  matureContent: string;
  illustration: string;
}



export async function POST(req: NextRequest) {
  try {
    const { filenames } = await req.json();
    const apiKey = req.headers.get('x-openai-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is required. Please set it in Settings." },
        { status: 401 }
      );
    }

    if (!Array.isArray(filenames)) {
      return NextResponse.json({ error: "filenames must be an array" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const results: ShutterstockResult[] = [];

    for (const filename of filenames) {
      // Description (up to 200 characters)
      const descResp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert AI assistant that generates detailed descriptions for stock media. Create unique and detailed descriptions in English." },
          { role: "user", content: `Create a unique and detailed description for this stock icon/media with the following rules:
                                    - Write in English
                                    - Maximum 200 characters
                                    - Be descriptive and specific
                                    - Focus on what the icon represents and its potential uses
                                    - Do not include quotes
                                    - Example: "Minimalist home icon perfect for real estate websites, mobile apps, and user interfaces. Clean line art style suitable for modern digital designs."
                                    Filename: ${filename}
          ` },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });
      const description = (descResp.choices?.[0]?.message?.content || "").slice(0, 200);

      // Keywords (up to 50 keywords)
      const kwResp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an AI assistant who helps create metadata for stock media." },
          { role: "user", content: `Create a list of keywords for this stock icon with the following rules:
                                    - Write in English
                                    - Maximum 50 keywords
                                    - Separate with commas
                                    - Include relevant terms like: Nature, Animals/Wildlife, etc.
                                    - Focus on the meaning, function, and visual style of the icon
                                    - Include both specific and general terms
                                    - Example: "home, house, building, real estate, property, residential, architecture, dwelling, shelter, roof"
                                    Filename: ${filename}
          ` },
        ],
        temperature: 0.7,
        max_tokens: 400,
      });
      let keywords = kwResp.choices?.[0]?.message?.content || "";
      keywords = keywords
        .split(/,|\n|\r/)
        .map((k) => k.trim())
        .filter(Boolean)
        .slice(0, 50)
        .join(", ");

      // Categories (AI-powered category determination)
      const categoryResp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an AI assistant that categorizes stock media into Shutterstock categories. You must respond with 1-2 category names separated by commas." },
          { role: "user", content: `Determine the most appropriate Shutterstock categories for this icon:

Filename: ${filename}
Keywords: ${keywords}

Available Categories:
Abstract, Animals/Wildlife, Arts, Backgrounds/Textures, Beauty/Fashion, Buildings/Landmarks, Business/Finance, Celebrities, Education, Food and drink, Healthcare/Medical, Holidays, Industrial, Interiors, Miscellaneous, Nature, Objects, Parks/Outdoor, People, Religion, Science, Signs/Symbols, Sports/Recreation, Technology, Transportation, Vintage

Respond with 1-2 most relevant category names separated by commas:` }
        ],
        temperature: 0.3,
        max_tokens: 50,
      });
      
      const categoryResponse = categoryResp.choices?.[0]?.message?.content?.trim() || "Miscellaneous";
      
      // Editorial (No for icons/graphics)
      const editorial = "No";
      
      // Mature Content (No for icons/graphics)
      const matureContent = "No";
      
      // Illustration (Yes for icons/graphics)
      const illustration = "Yes";

      results.push({ 
        filename, 
        description, 
        keywords, 
        categories: categoryResponse,
        editorial,
        matureContent,
        illustration
      });
    }

    return NextResponse.json({ data: results });
  } catch (e: unknown) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}