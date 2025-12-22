import openai
from dotenv import load_dotenv
import os
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI()

def summarize(text, prompt):
    response = client.chat.completions.create(
        model="gpt-5.2",
        messages=[
            {"role": "system", "content": "You are an expert research analyst summarizing technical material. Your task is to identify the shared theme across multiple passages and produce a concise, accurate summary."},
            {"role": "user", "content": f"{prompt}\n\n{text}"}
        ],
        max_completion_tokens=300,
        temperature=0.2
    )
    return response.choices[0].message.content
