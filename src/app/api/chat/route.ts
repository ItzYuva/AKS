import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import About, { IAbout } from "@/models/About";
import Project, { IProject } from "@/models/Project";
import Blog, { IBlog } from "@/models/Blog";
import Contact, { IContact } from "@/models/Contact";

// --- IP-based rate limiting ---
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // max requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

const BASE_PROMPT = `You are Aditya Sinha's personal AI assistant embedded on his portfolio website. Your ONLY purpose is to answer questions about Aditya Sinha.

## IMPORTANT RULES:
1. You must ONLY answer questions related to Aditya Sinha — his skills, projects, experience, education, interests, or anything about him.
2. If a user asks ANYTHING not related to Aditya, respond EXACTLY with:
   "I'm here to answer questions about Aditya only! Feel free to ask me about his skills, projects, experience, or anything else about him."
3. Be friendly, concise, and helpful.
4. Do not make up information. Only use what is provided below.
5. If you don't have specific information to answer a question about Aditya, say something like: "I don't have that specific detail about Aditya right now, but feel free to reach out to him directly via the contact page!"
6. Keep all your responses concise and under 100 words.`;

async function buildSystemPrompt(): Promise<string> {
  await connectDB();

  const [about, projects, blogs, contact] = await Promise.all([
    About.findOne<IAbout>().lean(),
    Project.find<IProject>().lean(),
    Blog.find<IBlog>().lean(),
    Contact.findOne<IContact>().lean(),
  ]);

  let prompt = BASE_PROMPT + "\n\n## PERSONAL INFORMATION:\n";

  if (about) {
    prompt += `\n**Bio:** ${about.bio}\n`;

    if (about.skills?.length) {
      prompt += "\n**Skills:**\n";
      about.skills.forEach((s) => {
        prompt += `- ${s.name} (${s.level})\n`;
      });
    }

    if (about.experience?.length) {
      prompt += "\n**Experience:**\n";
      about.experience.forEach((e) => {
        prompt += `- ${e.title} at ${e.company} (${e.period})`;
        if (e.description?.length) {
          prompt += ": " + e.description.join("; ");
        }
        prompt += "\n";
      });
    }

    if (about.education?.length) {
      prompt += "\n**Education:**\n";
      about.education.forEach((e) => {
        prompt += `- ${e.degree} from ${e.institution} (${e.period}) — ${e.description}\n`;
      });
    }
  }

  if (about?.chatbotInfo) {
    prompt += `\n**Additional Info:**\n${about.chatbotInfo}\n`;
  }

  if (contact) {
    prompt += "\n**Contact:**\n";
    if (contact.email) prompt += `- Email: ${contact.email}\n`;
    if (contact.phone) prompt += `- Phone: ${contact.phone}\n`;
    if (contact.location) prompt += `- Location: ${contact.location}\n`;
    if (contact.githubUrl) prompt += `- GitHub: ${contact.githubUrl}\n`;
    if (contact.linkedinUrl) prompt += `- LinkedIn: ${contact.linkedinUrl}\n`;
  }

  if (projects?.length) {
    prompt += "\n**Projects:**\n";
    projects.forEach((p) => {
      prompt += `- ${p.title}: ${p.description} | Tech: ${p.technologies.join(", ")}`;
      if (p.githubLink) prompt += ` | GitHub: ${p.githubLink}`;
      if (p.demoLink) prompt += ` | Demo: ${p.demoLink}`;
      prompt += "\n";
    });
  }

  if (blogs?.length) {
    prompt += "\n**Blogs:**\n";
    blogs.forEach((b) => {
      prompt += `- "${b.title}" (${b.date}, ${b.readTime}) — ${b.excerpt}`;
      if (b.mediumUrl) prompt += ` | Link: ${b.mediumUrl}`;
      prompt += "\n";
    });
  }

  return prompt;
}

export async function POST(req: NextRequest) {
  try {
    // --- Rate limiting by IP ---
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0].trim() || "unknown";
    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Slow down! You're sending too many messages. Please wait a minute." },
        { status: 429 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // --- Message length validation ---
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.content && lastMsg.content.length > 500) {
      return Response.json(
        { error: "Message is too long. Please keep it under 300 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Chat service is not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = await buildSystemPrompt();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: systemPrompt,
    });

    // Strip the initial UI greeting message before sending to API.
    // Gemini requires history to start with a "user" role.
    const apiMessages = messages.filter(
      (m: { role: string; content: string }, i: number) =>
        !(m.role === "assistant" && i === 0)
    );

    // Only send the last 6 messages to limit token usage
    const recentMessages = apiMessages.slice(-6);

    const history = recentMessages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = recentMessages[recentMessages.length - 1].content;

    const result = await chat.sendMessageStream(lastMessage);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`
            )
          );
          controller.close();
          console.error("Streaming error:", err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
