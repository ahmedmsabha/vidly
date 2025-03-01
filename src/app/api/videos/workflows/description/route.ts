import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { generateText } from "ai";
import { createWorkflowOpenAI } from "@/app/ai/ai-workflow";

interface InputType {
  userId: string;
  videoId: string;
}

const DESCRIPTION_SYSTEM_PROMPT = `Your task is to summarize the transcript of a video. Please follow these guidelines:
- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.`;

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
        content: DESCRIPTION_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: transcript,
      },
    ],
  });

  await context.run("update-video", async () => {
    const description = result.text;

    if (!description) {
      throw new Error("Bad request");
    }

    await db
      .update(videos)
      .set({ description: description || existingVideo.description })
      .where(
        and(
          eq(videos.id, existingVideo.id),
          eq(videos.userId, existingVideo.userId)
        )
      );
  });
});
