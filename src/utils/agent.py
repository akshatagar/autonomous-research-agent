import openai
from dotenv import load_dotenv
import os

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI()

summarize_prompt = """
Given the following passages, which all discuss related aspects of a broader topic:

Your task is to:
1) Identify the single main theme that connects them.
2) Produce a short, specific title (max 8 words).
3) List 3 concise key points capturing the most important ideas.

Do not introduce information that is not present in the passages.
Do not repeat the same idea in different wording.
Avoid generic statements.

Output exactly in the following format:

CLUSTER_TITLE: <title>

KEY_POINTS:
- <point 1>
- <point 2>
- <point 3>
"""

report_prompt = """
You are given multiple summarized themes related to a single research topic.

Your task is to:
- Merge overlapping ideas across themes
- Identify the most important and actionable insights
- Eliminate redundancy and minor details
- Focus on high-level trends, implications, and direction

Do NOT introduce any information that is not present in the provided summaries.
Do NOT repeat the same idea in different wording.

Produce an Executive Research Brief using the following structure:

Executive Research Brief
Topic: <research topic>

Key Themes:
1. <Theme Title>
   - <1-2 concise insight bullets>
2. <Theme Title>
   - <1-2 concise insight bullets>

Strategic Implications:
- <2-3 bullets describing what these trends imply at a strategic level>

Conclusion:
<A short synthesis paragraph summarizing overall direction and significance>
"""


def summarize(text, prompt=summarize_prompt):
    response = client.chat.completions.create(
        model="gpt-5.2",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert research analyst summarizing technical material. "
                    "Your task is to identify the shared theme across multiple passages "
                    "and produce a concise, accurate summary."
                )
            },
            {"role": "user", "content": f"{prompt}\n\n{text}"}
        ],
        max_completion_tokens=300,
        temperature=0.2
    )
    return response.choices[0].message.content


def report(text, prompt=report_prompt):
    response = client.chat.completions.create(
        model="gpt-5.2",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert research analyst producing an executive-level "
                    "research brief for senior decision-makers."
                    "Your task is to synthesize multiple summarized themes"
                    "into a coherent, strategic report."
                )
            },
            {"role": "user", "content": f"{prompt}\n\n{text}"}
        ],
        max_completion_tokens=400,
        temperature=0.2
    )
    return response.choices[0].message.content
