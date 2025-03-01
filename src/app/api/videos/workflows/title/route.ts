import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { createWorkflowOpenAI } from "@/app/ai/ai-workflow";
import { generateText } from "ai";

interface InputType {
  userId: string;
  videoId: string;
}

const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.`;

export const { POST } = serve(async (context) => {
  const { userId, videoId } = context.requestPayload as InputType;

  const existingVideo = await context.run("get-video", async () => {
    const [video] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!video) {
      throw new Error("Video not found");
    }

    return video;
  });

  const transcript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${existingVideo.muxPlaybackId}/text/${existingVideo.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = await response.text();
    if (!text) {
      throw new Error("Bad request");
    }
    return text;
  });

  const aiModel = createWorkflowOpenAI(context);

  const result = await generateText({
    model: aiModel("gemini-2.0-flash-001"),
    maxTokens: 2048,
    messages: [
      {
        role: "system",
        content: TITLE_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: transcript,
      },
    ],
  });


  await context.run("update-video", async () => {
    const title = result.text;

    if (!title) {
      throw new Error("Bad request");
    }

    await db
      .update(videos)
      .set({ title })
      .where(
        and(
          eq(videos.id, existingVideo.id),
          eq(videos.userId, existingVideo.userId)
        )
      );
  });
});
