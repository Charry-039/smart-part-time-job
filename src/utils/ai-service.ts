// AI 服务 - 用于前端调用 Google GenAI API
import { GoogleGenAI } from '@google/genai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

if (!API_KEY) {
  console.warn('警告: GEMINI_API_KEY 未配置，AI 功能将不可用')
}

/**
 * 获取 AI 求职建议
 * @param skills 用户技能
 * @param availableTime 可用时间
 * @param expectedSalary 期望薪资
 * @returns AI 生成的建议文本
 */
export async function getAIJobRecommendation(
  skills: string,
  availableTime: string,
  expectedSalary: string
): Promise<string> {
  try {
    const ai = new GoogleGenAI({
      apiKey: API_KEY,
    })

    const model = 'gemini-flash-lite-latest'
    
    const prompt = `你是一个专业的兼职求职顾问。请根据以下信息，为求职者提供精准的兼职建议：

技能特长：${skills}
可用时间：${availableTime}
期望薪资：${expectedSalary}

请提供：
1. 最适合的兼职类型（2-3种）
2. 每种兼职的优势分析
3. 具体的求职建议和注意事项
4. 预估薪资范围

要求：
- 回答简洁明了，不超过300字
- 语气亲切友好
- 给出可操作的建议`

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ]

    const response = await ai.models.generateContentStream({
      model,
      contents,
    })

    let fullText = ''
    for await (const chunk of response) {
      if (chunk.text) {
        fullText += chunk.text
      }
    }

    return fullText || '抱歉，AI 暂时无法生成建议，请稍后再试。'
  } catch (error) {
    console.error('AI 调用失败:', error)
    throw new Error('AI 服务暂时不可用，请稍后再试')
  }
}
