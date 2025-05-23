import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const API_URL = "https://api.siliconflow.cn/v1/chat/completions";
const API_KEY = process.env.API_KEY || "sk-aegsuslymdcshizzcuwbvwfjntaagsywvkejqfkuu";

const systemPrompt = `# AI天津话吵架（文明幽默版）养成指南 

## 核心目标：
学习并模仿天津人吵架的独特风格：要吵出气势，吵出幽默，吵出"哏儿"，但坚决不使用低俗、不文明的词汇（尤其避免涉及生殖器或与性相关的粗话）。我们的目标是成为一个"有文化、有水平"的天津话吵架高手。

## 人设定位：
你是一位土生土长的天津"卫嘴子"，性格直爽，说话自带幽默感，擅长用语言的艺术进行"掰哧"。你吵架不是为了把对方骂倒，而是要用智慧和气势在语言上"拿捏"对方，甚至让旁观者都觉得"倍儿有意思"。`;

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const searchParams = new URL(req.url).searchParams;
  const opponentWords = searchParams.get("opponentWords");
  const angerLevel = parseInt(searchParams.get("angerLevel") || "5");

  if (!opponentWords) {
    return new Response(
      JSON.stringify({ error: "Missing opponent words" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const userPrompt = `对方说："${opponentWords}"。请用天津话回击，要求幽默、有气势但不低俗。愤怒等级：${angerLevel}（1-10级）。请生成3条不同的回应，每条用换行分隔。`;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 发送思考状态
        controller.enqueue(encoder.encode('data: {"type": "thinking", "message": "AI正在思考中..."}\n\n'));
        
        // 调用AI API
        const aiResponse = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "Qwen/QwQ-32B",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.7 + (angerLevel * 0.03),
            max_tokens: 1000,
          }),
        });

        if (!aiResponse.ok) {
          throw new Error(\`API request failed with status \${aiResponse.status}\`);
        }

        const data = await aiResponse.json();
        const content = data.choices[0].message.content;
        
        // 分割成3条回应
        const responses = content.split(/\n\s*\d+[\.\)]\s*|\n\s*-\s*|\n\n+/)
          .filter(Boolean)
          .map(resp => resp.trim())
          .slice(0, 3);
        
        // 发送3条回应
        for (let i = 0; i < responses.length; i++) {
          const responseData = \`data: {"type": "response", "index": \${i}, "content": "\${responses[i].replace(/"/g, '\\"')}"}\n\n\`;
          controller.enqueue(encoder.encode(responseData));
          // 添加小延迟，让前端显示更自然
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // 发送完成
        controller.enqueue(encoder.encode('data: {"type": "done"}\n\n'));
        controller.close();
        
      } catch (error) {
        console.error("Error generating response:", error);
        const errorData = \`data: {"type": "error", "message": "生成失败，请重试"}\n\n\`;
        controller.enqueue(encoder.encode(errorData));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'X-Accel-Buffering': 'no'
    },
  });
}