# 给 Bolt.new 的项目指令

请创建一个**天津话吵架助手**Web应用，具体要求如下：

## 核心功能
1. 用户输入对方说的话
2. 调节愤怒等级(1-10级滑动条)
3. 点击生成按钮，AI实时返回3条天津话回击
4. 保存历史记录
5. 支持深浅色主题切换

## 技术栈
- **Next.js 14** (App Router)
- **React 18.2.0**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/ui组件库**

## 重要配置说明
**⚠️ 关键：此项目需要API路由功能，不能使用静态导出模式**

### Next.js配置 (next.config.js)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true
  },
  // 不要使用 output: 'export' - 这会导致API路由失效
};

module.exports = nextConfig;
```

## API配置
```javascript
// 在 /api/generate-response/route.ts 中
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // 重要：必须是nodejs，不是edge

const API_URL = "https://api.siliconflow.cn/v1/chat/completions";
const API_KEY = "sk-aegsuslymdcshizzcuwbvwfjntaagsywvkejqfkuu";

// 请求配置
{
  model: "Qwen/QwQ-32B",
  temperature: 0.7 + (angerLevel * 0.03),
  max_tokens: 1000
}
```

## 系统Prompt
请使用以下完整的系统prompt：

```
# AI天津话吵架（文明幽默版）养成指南 

## 核心目标：
学习并模仿天津人吵架的独特风格：要吵出气势，吵出幽默，吵出"哏儿"，但坚决不使用低俗、不文明的词汇（尤其避免涉及生殖器或与性相关的粗话）。我们的目标是成为一个"有文化、有水平"的天津话吵架高手。

## 人设定位：
你是一位土生土长的天津"卫嘴子"，性格直爽，说话自带幽默感，擅长用语言的艺术进行"掰哧"。你吵架不是为了把对方骂倒，而是要用智慧和气势在语言上"拿捏"对方，甚至让旁观者都觉得"倍儿有意思"。

## 核心技能与策略：

1. **万事皆可"哏" (Gén is Everything):** 将相声的思维融入对话。每隔几句话，尝试加入一个"包袱"、一个巧妙的转折、一句俏皮话或一个意想不到的类比。

2. **夸张是门艺术 (The Art of Exaggeration):** 对事物、行为或情绪进行极致的、超乎寻常的放大，制造戏剧性和幽默感。

3. **活用比喻和歇后语 (Master Metaphors & Allegorical Sayings):** 多使用源于生活、形象生动的天津特色歇后语或自创比喻。确保比喻文明且有趣。

4. **反问的力量 (The Power of Rhetorical Questions):** 多用反问句来强调观点，表达不满或质疑，配合天津话特有的上扬语调。

5. **排比反复造气势 (Build Momentum with Parallelism & Repetition):** 使用结构相似的短句或反复强调某个词语，形成连贯的气势和节奏。

6. **融入地道"卫"味 (Authentic Tianjin Flavor):** 自然地使用天津方言特色词汇和语气词，如："倍儿棒"、"嘛意思啊这是"、"甭废话"、"腻歪"、"崴泥"、"掰哧清楚"、"白饶"、"劳驾了您呐"等。

7. **保持"文明"底线 (Maintain Civility):** 严格禁止任何涉及生殖器官、性行为的粗俗词语。用幽默的讽刺、夸张的描述、或"指桑骂槐"的智慧来表达不满。

## 最终目标：
让AI的吵架听起来像一场精彩的单口相声，让对方在"捧腹大笑"和"哑口无言"之间反复横跳，充分展现天津语言文化的魅力。记住，最高境界是"吵"完之后，对方还想请你吃饭！
```

## 关键技术要求

### 1. 使用Server-Sent Events (SSE)
```javascript
// /api/generate-response/route.ts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // 必须使用nodejs运行时

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  
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
        
        const data = await aiResponse.json();
        const content = data.choices[0].message.content;
        
        // 分割成3条回应
        const responses = content.split(/\n\s*\d+[\.\)]\s*|\n\s*-\s*|\n\n+/)
          .filter(Boolean)
          .map(resp => resp.trim())
          .slice(0, 3);
        
        // 发送3条回应
        for (let i = 0; i < responses.length; i++) {
          const responseData = `data: {"type": "response", "index": ${i}, "content": "${responses[i].replace(/"/g, '\\"')}"}\n\n`;
          controller.enqueue(encoder.encode(responseData));
        }
        
        // 发送完成
        controller.enqueue(encoder.encode('data: {"type": "done"}\n\n'));
        controller.close();
        
      } catch (error) {
        const errorData = `data: {"type": "error", "message": "生成失败，请重试"}\n\n`;
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
    },
  });
}
```

### 2. 前端SSE接收
```javascript
const [responses, setResponses] = useState<string[]>([]);
const [isLoading, setIsLoading] = useState(false);

const handleGenerate = () => {
  setIsLoading(true);
  setResponses([]);
  
  const eventSource = new EventSource(
    `/api/generate-response?opponentWords=${encodeURIComponent(input)}&angerLevel=${angerLevel}`
  );

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'thinking') {
      // 显示思考状态
    } else if (data.type === 'response') {
      setResponses(prev => {
        const newResponses = [...prev];
        newResponses[data.index] = data.content;
        return newResponses;
      });
    } else if (data.type === 'done') {
      setIsLoading(false);
      eventSource.close();
    } else if (data.type === 'error') {
      setIsLoading(false);
      // 显示错误提示
      eventSource.close();
    }
  };

  eventSource.onerror = () => {
    setIsLoading(false);
    eventSource.close();
  };
};
```

## 部署配置

### 对于Vercel (推荐)
```json
// vercel.json (可选，通常不需要额外配置)
{
  "functions": {
    "app/api/generate-response/route.ts": {
      "maxDuration": 30
    }
  }
}
```

### 对于Netlify
```toml
# netlify.toml
[build]
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[functions]
  node_bundler = "esbuild"
```

## UI组件要求
1. **输入框**：大的文本输入区域，placeholder: "请输入对方说的话..."
2. **愤怒值滑动条**：1-10级，显示当前值，默认值5
3. **生成按钮**：触发AI生成，加载时显示"生成中..."
4. **响应区域**：显示3条AI回应，每条都有复制按钮
5. **历史记录**：左侧边栏或下方显示历史对话
6. **主题切换**：右上角的深浅色主题切换按钮

## 重要注意事项
1. **不要使用静态导出**：`output: 'export'` 会导致API路由失效
2. **运行时配置**：API路由必须使用 `nodejs` 运行时
3. **依赖版本**：确保React 18.2.0 + Next.js 14.1.0兼容
4. **SSE响应头**：确保设置正确的流式响应头
5. **错误处理**：优雅处理网络错误和API调用失败
6. **部署平台**：必须支持Node.js服务端功能的平台

## 示例交互
- 用户输入："你这人怎么这样"
- 愤怒值：6
- AI返回3条天津话回击，风格幽默而不失气势

## 部署平台兼容性
- ✅ **Vercel** (推荐，原生支持Next.js)
- ✅ **Netlify** (需要@netlify/plugin-nextjs插件)
- ✅ **Railway** (支持Node.js应用)
- ❌ **静态托管平台** (GitHub Pages, Surge等 - 不支持API路由)

**重要提醒：这是一个全栈Next.js应用，需要服务端运行时支持，不能部署为纯静态网站。** 