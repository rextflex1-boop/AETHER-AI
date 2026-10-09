import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ChatMessagePart {
  text?: string;
  image?: {
    mimeType: string;
    data: string;
  };
}

interface ChatMessage {
  role: 'user' | 'model';
  parts?: ChatMessagePart[];
  text?: string;
  image?: {
    mimeType: string;
    data: string;
  };
}

// Supported valid models with highest availability first
const AVAILABLE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash',
];

async function getStreamWithFallback(requestedModel: string, contents: any[], config: any) {
  // Always prioritize models with active available quota and low latency
  const modelsToTry = [
    'gemini-3.1-flash-lite',
    requestedModel,
    'gemini-flash-latest',
    'gemini-3.8-flash',
  ].filter((v, i, a) => a.indexOf(v) === i);

  let lastError: any = null;

  for (const modelCandidate of modelsToTry) {
    try {
      console.log(`[Ask AI] Streaming with model: ${modelCandidate}`);
      const stream = await ai.models.generateContentStream({
        model: modelCandidate,
        contents,
        config,
      });
      return { stream, modelUsed: modelCandidate };
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || '';
      console.warn(`[Ask AI] Model ${modelCandidate} failed: ${errMsg.slice(0, 100)}`);
      // Try next model immediately
      continue;
    }
  }

  throw lastError;
}

// Stream chat generation endpoint
app.post('/api/chat/stream', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      messages = [],
      systemInstruction = '',
      temperature = 0.7,
      model = 'gemini-3.1-flash-lite',
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages are required and must be an array.' });
      return;
    }

    const contents = messages.map((msg: ChatMessage) => {
      const parts: any[] = [];
      if (msg.image && msg.image.data) {
        const base64Data = msg.image.data.replace(/^data:[^;]+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType: msg.image.mimeType || 'image/jpeg',
            data: base64Data,
          },
        });
      }
      if (msg.text) {
        parts.push({ text: msg.text });
      } else if (msg.parts && Array.isArray(msg.parts)) {
        for (const p of msg.parts) {
          if (p.image?.data) {
            const b64 = p.image.data.replace(/^data:[^;]+;base64,/, '');
            parts.push({
              inlineData: {
                mimeType: p.image.mimeType || 'image/jpeg',
                data: b64,
              },
            });
          }
          if (p.text) {
            parts.push({ text: p.text });
          }
        }
      }

      if (parts.length === 0) {
        parts.push({ text: '' });
      }

      return {
        role: msg.role === 'model' ? 'model' : 'user',
        parts,
      };
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const config: any = {};
    if (systemInstruction && systemInstruction.trim().length > 0) {
      config.systemInstruction = systemInstruction.trim();
    }
    if (typeof temperature === 'number') {
      config.temperature = Math.max(0, Math.min(2, temperature));
    }

    const { stream: responseStream, modelUsed } = await getStreamWithFallback(
      model || 'gemini-3.1-flash-lite',
      contents,
      config
    );

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text, modelUsed })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Gemini chat streaming error:', error);
    let userFriendlyMsg = error.message || 'Internal Server Error';
    if (error.message?.includes('503') || error.message?.includes('429') || error.message?.includes('high demand') || error.message?.includes('quota')) {
      userFriendlyMsg = 'Model par abhi heavy traffic tha. Kripya 2 second baad dobara Send karein!';
    }
    if (!res.headersSent) {
      res.status(500).json({ error: userFriendlyMsg });
    } else {
      res.write(`data: ${JSON.stringify({ error: userFriendlyMsg })}\n\n`);
      res.end();
    }
  }
});

// Auto-generate conversation title with robust fallback
app.post('/api/chat/title', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt = '' } = req.body;
    if (!prompt) {
      res.json({ title: 'New Conversation' });
      return;
    }

    const cleanPrompt = prompt.slice(0, 300);
    const titleInstruction = `Generate a concise 3 to 5 word title for a conversation starting with: "${cleanPrompt}". Return only the plain title, nothing else.`;

    let generatedTitle = '';
    for (const modelCandidate of AVAILABLE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelCandidate,
          contents: titleInstruction,
        });
        if (response.text) {
          generatedTitle = response.text.trim().replace(/^["']|["']$/g, '');
          break;
        }
      } catch (e: any) {
        continue;
      }
    }

    if (!generatedTitle) {
      generatedTitle = cleanPrompt.length > 25 ? `${cleanPrompt.slice(0, 25)}...` : cleanPrompt;
    }

    res.json({ title: generatedTitle || 'New Conversation' });
  } catch (error: any) {
    console.error('Title generation error:', error);
    res.json({ title: 'New Conversation' });
  }
});

const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
