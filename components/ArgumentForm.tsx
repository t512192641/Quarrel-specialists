"use client";

import { useState, useEffect } from "react";
import { CornerDownRight, Loader2, Sparkles, Clock, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { ArgumentHistory } from "@/lib/types";
import ResponseCard from "@/components/ResponseCard";
import { Progress } from "@/components/ui/progress";

export default function ArgumentForm() {
  const [opponentWords, setOpponentWords] = useState("");
  const [angerLevel, setAngerLevel] = useState([5]);
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ArgumentHistory[]>([]);
  const [progress, setProgress] = useState(0);
  const [thinking, setThinking] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("argumentHistory");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  }, []);

  // Progress bar animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 1000);
    } else {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const saveToHistory = () => {
    if (responses.length === 0) {
      toast({
        title: "没有可保存的内容",
        description: "请先生成回应后再保存",
        variant: "destructive",
      });
      return;
    }

    const newHistoryItem = {
      id: Date.now(),
      opponentWords,
      angerLevel: angerLevel[0],
      responses,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [newHistoryItem, ...history].slice(0, 10); // Keep only last 10 items
    setHistory(updatedHistory);
    localStorage.setItem("argumentHistory", JSON.stringify(updatedHistory));

    toast({
      title: "保存成功",
      description: "已保存到历史记录",
    });
  };

  const clearForm = () => {
    setOpponentWords("");
    setAngerLevel([5]);
    setResponses([]);
  };

  const generateResponses = async () => {
    if (!opponentWords.trim()) {
      toast({
        title: "请输入对方的话",
        description: "需要填写对方说的话才能生成回应",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResponses([]);
    setThinking(true);

    try {
      // 使用URLSearchParams构建查询参数
      const params = new URLSearchParams({
        opponentWords: opponentWords,
        angerLevel: angerLevel[0].toString()
      });

      // 构建API URL
      const apiUrl = `/api/generate-response?${params.toString()}`;
      console.log(`[前端 ${new Date().toLocaleTimeString()}] 请求URL:`, apiUrl);

      // 创建一个新的EventSource连接
      const eventSource = new EventSource(apiUrl);
      console.log(`[前端 ${new Date().toLocaleTimeString()}] EventSource已创建`);

      const tempResponses: string[] = ["", "", ""];

      // 监听消息事件
      eventSource.onmessage = (event) => {
        console.log(`[前端 ${new Date().toLocaleTimeString()}] 收到SSE消息:`, event.data);
        try {
          const data = JSON.parse(event.data);
          console.log(`[前端 ${new Date().toLocaleTimeString()}] 解析结果:`, data);

          if (data.type === "thinking") {
            console.log(`[前端 ${new Date().toLocaleTimeString()}] 设置thinking=true`);
            setThinking(true);
          } else if (data.type === "response") {
            console.log(`[前端 ${new Date().toLocaleTimeString()}] 收到response, index=`, data.index);
            console.log(`[前端 ${new Date().toLocaleTimeString()}] 开始更新响应数据`);
            setThinking(false);
            setResponses(prev => {
              const newResponses = [...prev];
              newResponses[data.index] = data.content;
              console.log(`[前端 ${new Date().toLocaleTimeString()}] 更新第${data.index}条响应完成`);
              return newResponses;
            });
          } else if (data.type === "done") {
            console.log(`[前端 ${new Date().toLocaleTimeString()}] 接收完成`);
            eventSource.close();
            setThinking(false);
            setLoading(false);
          } else if (data.type === "error") {
            console.error(`[前端 ${new Date().toLocaleTimeString()}] 错误:`, data.message);
            toast({
              title: "生成失败",
              description: data.message || "未知错误",
              variant: "destructive",
            });
            eventSource.close();
            setThinking(false);
            setLoading(false);
          }
        } catch (e) {
          console.error("[前端] 解析SSE数据错误:", e);
        }
      };

      // 监听错误事件
      eventSource.onerror = (error) => {
        console.error("[前端] EventSource错误:", error);
        
        toast({
          title: "连接错误",
          description: "与服务器的连接中断，请重试",
          variant: "destructive",
        });
        eventSource.close();
        setLoading(false);
        setThinking(false);
      };

      // 返回一个清理函数，在组件卸载时关闭连接
      return () => {
        console.log("[前端] 清理EventSource连接");
        eventSource.close();
      };
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "生成失败",
        description: error instanceof Error ? error.message : "请稍后再试",
        variant: "destructive",
      });
      setLoading(false);
      setThinking(false);
    }
  };

  // Get anger level text
  const getAngerLevelText = (level: number) => {
    if (level <= 3) return "温和";
    if (level <= 6) return "较强";
    if (level <= 8) return "激烈";
    return "极端";
  };

  // Get anger level color
  const getAngerLevelColor = (level: number) => {
    if (level <= 3) return "bg-green-500";
    if (level <= 6) return "bg-yellow-500";
    if (level <= 8) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="py-8">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="opponentWords" className="text-sm font-medium mb-2 block">
                对方的话
              </label>
              <Textarea
                id="opponentWords"
                placeholder="输入对方说的话..."
                value={opponentWords}
                onChange={(e) => setOpponentWords(e.target.value)}
                className="min-h-[100px] border-2 focus-visible:ring-2 focus-visible:ring-offset-2"
              />
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="angerLevel" className="text-sm font-medium">
                  愤怒值
                </label>
                <Badge 
                  variant="outline" 
                  className={`${getAngerLevelColor(angerLevel[0])} text-white font-medium transition-colors duration-300`}
                >
                  {getAngerLevelText(angerLevel[0])} - {angerLevel[0]}
                </Badge>
              </div>
              <Slider
                id="angerLevel"
                value={angerLevel}
                min={1}
                max={10}
                step={1}
                onValueChange={setAngerLevel}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>温和</span>
                <span>较强</span>
                <span>激烈</span>
                <span>极端</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <Button 
                onClick={generateResponses} 
                disabled={loading || !opponentWords.trim()} 
                className="relative overflow-hidden group"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    开始吵架
                    <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={clearForm}
                disabled={loading || (!opponentWords.trim() && responses.length === 0)}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                重置
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={saveToHistory}
                disabled={loading || responses.length === 0}
              >
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
            </div>

            {loading && (
              <div className="mt-4">
                <Progress value={progress} className="h-2" />
                {thinking && (
                  <p className="text-sm text-muted-foreground mt-2 text-center animate-pulse">
                    AI正在思考中...
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Responses */}
      <AnimatePresence>
        {responses.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8 space-y-4"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <CornerDownRight className="mr-2 h-5 w-5 text-primary" />
              吵架回应
            </h2>
            
            <div className="space-y-4">
              {responses.map((response, index) => (
                <ResponseCard 
                  key={index} 
                  response={response} 
                  index={index} 
                  angerLevel={angerLevel[0]}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            历史记录
          </h2>
          
          <div className="space-y-6">
            {history.map((item) => (
              <Card key={item.id} className="border border-primary/10">
                <CardContent className="pt-6">
                  <div className="mb-2 flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">对方说:</h3>
                      <p className="text-sm text-muted-foreground">{item.opponentWords}</p>
                    </div>
                    <Badge variant="outline">
                      愤怒值: {item.angerLevel}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">回应:</h4>
                    {item.responses.map((response, idx) => (
                      <p key={idx} className="text-sm p-2 bg-secondary/50 rounded-md">{response}</p>
                    ))}
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}