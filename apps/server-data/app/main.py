from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import asyncio

app = FastAPI(title="AI Mock Service", version="1.0.0")

# 允许跨域，方便前端联调
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str

# 模拟 AI 思考的文本
MOCK_RESPONSE = """
你好！我是基于大模型构建的 AI 助手。

针对你提出的工单问题，我建议采取以下排查步骤：
1. 检查服务器 CPU 和内存使用率，确认是否存在资源瓶颈。
2. 查看应用日志（`tail -f /var/log/app.log`），定位具体的报错堆栈。
3. 如果是数据库连接池满了，可以尝试重启服务或调大 `max_connections`。

```javascript
// 示例：检查服务状态的 Node.js 脚本
const os = require('os');
console.log('Free Memory:', os.freemem());
```

如果问题仍未解决，请随时告诉我！
"""

@app.post("/api/chat/stream")
async def chat_stream(request: ChatRequest):
    async def generate():
        # 模拟大模型逐字生成的打字机效果
        for char in MOCK_RESPONSE:
            # SSE 标准格式：data: 文本\n\n
            yield f"data: {char}\n\n"
            await asyncio.sleep(0.02)  # 每个字间隔 20ms
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
