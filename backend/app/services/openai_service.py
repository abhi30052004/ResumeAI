import json
from openai import AsyncOpenAI
from ..config import settings
from ..models.analysis import AnalysisBase, ImprovementResponse

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def analyze_resume_with_ai(resume_text: str, job_description: str) -> dict:
    prompt = f"""
    Analyze the following resume against the given job description.
    Provide a detailed assessment including ATS score, job match score, keyword score, strengths, weaknesses, missing keywords, and section-by-section analysis.
    
    Resume:
    {resume_text}
    
    Job Description:
    {job_description}
    
    You must return a raw JSON object (no markdown formatting, no ```json) adhering to this exact schema:
    {{
      "ai_summary": "...",
      "ats_score": 0,
      "job_match_score": 0,
      "keyword_score": 0,
      "strengths": ["...", "..."],
      "weaknesses": ["...", "..."],
      "missing_keywords": ["...", "..."],
      "section_analysis": {{
        "summary": {{"score": 0, "feedback": "...", "suggestion": "..."}},
        "skills": {{"score": 0, "feedback": "...", "suggestion": "..."}},
        "experience": {{"score": 0, "feedback": "...", "suggestion": "..."}},
        "projects": {{"score": 0, "feedback": "...", "suggestion": "..."}},
        "education": {{"score": 0, "feedback": "...", "suggestion": "..."}}
      }}
    }}
    
    Do NOT invent information. Suggest improvements instead.
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert AI resume reviewer and ATS system simulator."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" }
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"OpenAI Error: {e}")
        # Return fallback mock data for now in case of failure or dummy API key
        return {
          "ai_summary": "AI analysis failed or dummy key used. Please configure valid OpenAI API key.",
          "ats_score": 50,
          "job_match_score": 50,
          "keyword_score": 50,
          "strengths": ["Dummy strength"],
          "weaknesses": ["Dummy weakness"],
          "missing_keywords": ["DummyKeyword"],
          "section_analysis": {
            "summary": {"score": 50, "feedback": "Dummy feedback", "suggestion": "Dummy suggestion"},
            "skills": {"score": 50, "feedback": "Dummy feedback", "suggestion": "Dummy suggestion"},
            "experience": {"score": 50, "feedback": "Dummy feedback", "suggestion": "Dummy suggestion"},
            "projects": {"score": 50, "feedback": "Dummy feedback", "suggestion": "Dummy suggestion"},
            "education": {"score": 50, "feedback": "Dummy feedback", "suggestion": "Dummy suggestion"}
          }
        }

async def improve_resume_section_with_ai(section_name: str, original_text: str, job_description: str) -> ImprovementResponse:
    prompt = f"""
    Improve the following text for the "{section_name}" section of a resume.
    Tailor it to match this job description:
    {job_description}
    
    Original Text:
    {original_text}
    
    You must return a JSON object (no markdown) with this schema:
    {{
      "improved_text": "...",
      "explanation": "Why this is better..."
    }}
    
    Rules: Do not invent facts, metrics, or experiences that are not strongly implied. Enhance the wording and ATS optimization.
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert AI resume writer."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" }
        )
        content = response.choices[0].message.content
        data = json.loads(content)
        return ImprovementResponse(**data)
    except Exception as e:
        print(f"OpenAI Error: {e}")
        return ImprovementResponse(
            improved_text=original_text + " (Improved mock)",
            explanation="This is a mock improvement due to API failure or dummy key."
        )

async def generate_resume_section_with_ai(section_name: str, current_content: str) -> dict:
    prompt = f"""
    You are an expert AI resume writer. The user is writing the "{section_name}" section of their resume.
    Here is what they have written so far (or any context they provided):
    {current_content}
    
    Please generate a highly professional, well-formatted, and impactful text for this section.
    Return ONLY a JSON object with this exact schema:
    {{
      "generated_text": "..."
    }}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert AI resume writer."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" }
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"OpenAI Error: {e}")
        return {
            "generated_text": current_content + "\n(AI generated mock content due to API failure or dummy key. Configure OpenAI API key to use real AI.)"
        }
