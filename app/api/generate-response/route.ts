import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const API_URL = "https://api.siliconflow.cn/v1/chat/completions";
const API_KEY = "sk-aegsuslymdcshizzcuwbvwfjntaagsywvkejmurzjkjqfkuu";

interface SiliconFlowError {
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
}

export async function GET(req: NextRequest) {
  const startTime = new Date();
  console.log(`[API ${startTime.toLocaleTimeString()}] 开始处理请求`);

  try {
    // 从 URL 查询参数中获取数据
    const searchParams = req.nextUrl.searchParams;
    const opponentWords = searchParams.get('opponentWords');
    const angerLevelStr = searchParams.get('angerLevel');
    const angerLevel = angerLevelStr ? parseInt(angerLevelStr, 10) : 5;
    
    console.log(`[API ${new Date().toLocaleTimeString()}] 从查询参数获取数据: opponentWords=${opponentWords}, angerLevel=${angerLevel}`);

    if (!opponentWords) {
      return NextResponse.json(
        { error: "对方的话不能为空" },
        { status: 400 }
      );
    }

    if (typeof angerLevel !== 'number' || angerLevel < 1 || angerLevel > 10) {
      return NextResponse.json(
        { error: "愤怒值必须是1到10之间的数字" },
        { status: 400 }
      );
    }

    const systemPrompt = `# AI天津话吵架（文明幽默版）养成指南 ## 核心目标： 学习并模仿天津人吵架的独特风格：要吵出气势，吵出幽默，吵出"哏儿"，但坚决不使用低俗、不文明的词汇（尤其避免涉及生殖器或与性相关的粗话）。我们的目标是成为一个"有文化、有水平"的天津话吵架高手。 ## 人设定位： 你是一位土生土长的天津"卫嘴子"，性格直爽，说话自带幽默感，擅长用语言的艺术进行"掰哧"。你吵架不是为了把对方骂倒，而是要用智慧和气势在语言上"拿捏"对方，甚至让旁观者都觉得"倍儿有意思"。 ## 核心技能与策略： 1. **万事皆可"哏" (Gén is Everything):** * **指导：** 将相声的思维融入对话。每隔几句话，尝试加入一个"包袱"、一个巧妙的转折、一句俏皮话或一个意想不到的类比。 * **示例思考方向：** "呦，您这嗓门儿，不去德云社报个到都屈才了！" 2. **夸张是门艺术 (The Art of Exaggeration):** * **指导：** 对事物、行为或情绪进行极致的、超乎寻常的放大，制造戏剧性和幽默感。 * **句式启发：** * "您这速度，嘛时候改纳秒计时啦？" (讽刺对方慢) * "我这心堵的，都能给您家下水道当塞子了！" (表达非常生气/郁闷) * "您这主意高！高的都够得着卫星了，就是不沾地气儿！" 3. **活用比喻和歇后语 (Master Metaphors & Allegorical Sayings):** * **指导：** 多使用源于生活、形象生动的天津特色歇后语或自创比喻。确保比喻文明且有趣。 * **句式启发：** * "您跟我说这个？整个一'茶壶里煮饺子——肚子里有货倒不出来'！" * "瞅瞅你那样儿，比那'刚从冰箱里拿出来的冻豆腐——蔫儿坏'还蔫儿！" * "您这逻辑，简直是'自行车上拉百货——能带多少是多少，全凭一张嘴'！" * 避免使用可能引起不适的歇后语，如涉及不雅生理现象的。例如，若"茅房里扔炸弹——激起公粪（愤）"这类因双关而出彩但略显粗俗的，可以替换为更温和的表达，或者在确保AI理解其"文明版"寓意（如仅取"激起公愤"之意）的前提下使用。优先选择如："你这可真是'王奶奶卖酸菜——净挑好的说'！" 4. **反问的力量 (The Power of Rhetorical Questions):** * **指导：** 多用反问句来强调观点，表达不满或质疑，配合天津话特有的上扬语调（AI通过文字和感叹号体现）。 * **句式启发：** * "我说的这理儿不对吗？啊？您给评评！" * "您自个儿说说，有您这么办事儿的吗？" * "嘛叫规矩？您懂嘛叫规矩吗？" 5. **排比反复造气势 (Build Momentum with Parallelism & Repetition):** * **指导：** 使用结构相似的短句或反复强调某个词语，形成连贯的气势和节奏。 * **句式启发：** * "您瞅瞅，这事儿您办的，像话吗？合理吗？能摆到桌面上说吗？" * "甭跟我来这套！我不吃这套！打我这儿过不去这套！" 6. **融入地道"卫"味 (Authentic Tianjin Flavor):** * **指导：** 自然地使用天津方言特色词汇和语气词，如："倍儿棒"、"嘛意思啊这是"、"甭废话"、"腻歪"、"崴泥"、"掰哧清楚"、"白饶"、"劳驾了您呐"等。注意"嘛"字的灵活运用。 * **示例：** "您这可真是'倍儿'能'掰哧'，但'嘛'有用的都没说出来！" 7. **保持"文明"底线 (Maintain Civility):** * **严格禁止：** 任何涉及生殖器官、性行为的粗俗词语。 * **替代方案：** 用幽默的讽刺、夸张的描述、或"指桑骂槐"的智慧来表达不满。例如，不说"你傻X"，可以说"您这脑袋瓜儿，估计是让门挤过，还是让驴踢过？"或者"您这智商，都够参加残奥会的智力竞赛了，还得坐小孩儿那桌。" (注意：即便是这类讽刺也需把握"度"，避免人身攻击，主要以幽默化解。) ## 练习场景建议： * 情景一：有人在食堂打饭时插队，你如何用天津话有理有节（且幽默地）表达不满并维护秩序？ * 情景二：邻居的宠物随地大小便，你如何用天津话与其"理论"一番，既指出问题又不伤和气（还能逗乐大家）？ * 情景三：讨论某个社会现象，对方观点荒谬，你如何用天津话进行反驳和"教育"？ ## 最终目标：让AI的吵架听起来像一场精彩的单口相声，让对方在"捧腹大笑"和"哑口无言"之间反复横跳，充分展现天津语言文化的魅力。记住，最高境界是"吵"完之后，对方还想请你吃饭！`;

    // 使用标准的流式响应方式
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 立即发送思考消息
          const thinkingMessage = encoder.encode('data: {"type": "thinking", "message": "AI正在思考中..."}\n\n');
          controller.enqueue(thinkingMessage);

          console.log(`[API] 开始调用AI接口，参数: ${opponentWords}, 愤怒值: ${angerLevel}`);
          
          const aiResponse = await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
              model: "Qwen/QwQ-32B",
              messages: [
                {
                  role: "system",
                  content: systemPrompt,
                },
                {
                  role: "user",
                  content: `对方说了: "${opponentWords}"\n\n请给我3条不同的吵架回应，愤怒程度为${angerLevel}分（满分10分）。记住，保持文明幽默、不粗俗，使用天津方言特色，让我的反驳既精彩又有气势。请将3条回应分别列出。`,
                },
              ],
              temperature: 0.7 + (angerLevel * 0.03),
              max_tokens: 1000,
            }),
          });

          console.log(`[API ${new Date().toLocaleTimeString()}] AI接口响应状态: ${aiResponse.status}`);

          if (!aiResponse.ok) {
            let errorMessage = "AI服务暂时不可用";
            try {
              const errorData = await aiResponse.json() as SiliconFlowError;
              if (errorData.error?.message) {
                errorMessage = errorData.error.message;
              }
            } catch {
              // If we can't parse the error JSON, use the default message
            }
            
            const errorMsg = encoder.encode(`data: {"type": "error", "message": "${errorMessage}"}\n\n`);
            controller.enqueue(errorMsg);
            controller.close();
            return;
          }

          const data = await aiResponse.json();
          console.log(`[API ${new Date().toLocaleTimeString()}] 成功获取AI响应数据`);
          
          if (!data.choices?.[0]?.message?.content) {
            const errorMsg = encoder.encode('data: {"type": "error", "message": "AI返回的数据格式错误"}\n\n');
            controller.enqueue(errorMsg);
            controller.close();
            return;
          }

          const content = data.choices[0].message.content;
          console.log(`[API ${new Date().toLocaleTimeString()}] AI原始响应内容: ${content.substring(0, 100)}...`);
          
          const responses = content
            .split(/\n\s*\d+[\.\)]\s*|\n\s*-\s*|\n\n+/)
            .filter(Boolean)
            .map((resp: string) => resp.trim())
            .slice(0, 3);
          
          console.log(`[API ${new Date().toLocaleTimeString()}] 分割后的响应数量: ${responses.length}`);
          
          if (responses.length > 0) {
            console.log(`[API ${new Date().toLocaleTimeString()}] 第一条响应: ${responses[0].substring(0, 50)}...`);
          }

          if (responses.length < 3) {
            const fullText = content.trim();
            const partLength = Math.floor(fullText.length / 3);
            const splitResponses = [
              fullText.substring(0, partLength),
              fullText.substring(partLength, partLength * 2),
              fullText.substring(partLength * 2),
            ];
            
            // 发送每个响应
            for (let i = 0; i < splitResponses.length; i++) {
              console.log(`[API ${new Date().toLocaleTimeString()}] 准备发送第${i+1}条分割响应`);
              const escapedContent = splitResponses[i]
                .replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/\t/g, '\\t');
              const responseData = encoder.encode(`data: {"type": "response", "index": ${i}, "content": "${escapedContent}"}\n\n`);
              controller.enqueue(responseData);
              console.log(`[API ${new Date().toLocaleTimeString()}] 第${i+1}条响应已发送`);
            }
          } else {
            // 发送每个响应
            for (let i = 0; i < responses.length; i++) {
              console.log(`[API ${new Date().toLocaleTimeString()}] 准备发送第${i+1}条响应`);
              const escapedContent = responses[i]
                .replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/\t/g, '\\t');
              const responseData = encoder.encode(`data: {"type": "response", "index": ${i}, "content": "${escapedContent}"}\n\n`);
              controller.enqueue(responseData);
              console.log(`[API ${new Date().toLocaleTimeString()}] 第${i+1}条响应已发送`);
            }
          }

          // 发送完成消息
          const doneMessage = encoder.encode('data: {"type": "done"}\n\n');
          controller.enqueue(doneMessage);
          controller.close();

        } catch (error) {
          console.error("[API] 处理过程中出错:", error);
          const errorMsg = encoder.encode(`data: {"type": "error", "message": "处理请求时出错"}\n\n`);
          controller.enqueue(errorMsg);
          controller.close();
        }
      }
    });

    // 立即返回响应，设置正确的SSE头
    const response = new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Accel-Buffering': 'no', // 禁用nginx缓冲
      },
    });
    
    console.log("[API] 响应头设置完成，准备发送数据");

    return response;

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "处理请求时出错" },
      { status: 500 }
    );
  }
}