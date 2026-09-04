import asyncio
from apify_client import ApifyClient
from app.config import settings
import openai
import re

class ApifyService:
    def __init__(self):
        self.client = ApifyClient(settings.APIFY_API_TOKEN)
        # Using a reliable LinkedIn jobs scraper actor
        self.actor_id = "bebity/linkedin-jobs-scraper"
        self.openai_client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def search_jobs(self, search_term: str, location: str = "Worldwide", max_items: int = 10, user_resume: str = ""):
        """
        Runs the Apify actor to scrape LinkedIn jobs and returns the results.
        Scores each job using OpenAI against the user's resume.
        """
        run_input = {
            "keywords": search_term,
            "location": location,
            "count": max_items,
        }

        try:
            # Run the Actor in a separate thread so it doesn't block the async loop
            def run_scraper():
                run = self.client.actor(self.actor_id).call(run_input=run_input)
                dataset_items = list(self.client.dataset(run["defaultDatasetId"]).iterate_items())
                return dataset_items

            dataset_items = await asyncio.to_thread(run_scraper)
            
            jobs = []
            
            # Create a list of tasks for scoring in parallel to save time
            async def process_item(item):
                job_title = item.get("title", "Unknown Role")
                company = item.get("companyName", item.get("company", "Unknown Company"))
                description = item.get("description", "")
                
                # Fetch a score asynchronously
                score = await self._score_job_with_ai(job_title, description, user_resume)
                
                return {
                    "id": item.get("id", item.get("url", str(len(jobs)))),
                    "title": job_title,
                    "company": company,
                    "location": item.get("location", "Remote"),
                    "salary": item.get("salary", "Salary Not Provided"),
                    "type": item.get("employmentType", item.get("contractType", "Full-time")),
                    "url": item.get("url", "#"),
                    "postedAt": item.get("postedAt", item.get("publishedAt", "Recent")),
                    "logo": company[0].upper(),
                    "matchScore": score
                }

            tasks = [process_item(item) for item in dataset_items[:max_items]]
            jobs = await asyncio.gather(*tasks)
            
            # Sort jobs by matchScore descending
            jobs.sort(key=lambda x: x["matchScore"], reverse=True)
            return jobs
            
        except Exception as e:
            print(f"Apify scraping failed: {str(e)}")
            return []

    async def _score_job_with_ai(self, job_title: str, job_description: str, user_resume: str) -> int:
        if not user_resume or not job_description:
            # Fallback if no resume is available
            import random
            return random.randint(70, 95)
            
        prompt = f"""
        You are an expert ATS (Applicant Tracking System) algorithm.
        Score the compatibility of this candidate's resume against the provided Job Description.
        
        Job Title: {job_title}
        Job Description:
        {job_description[:2000]}  # Limit to avoid token limits
        
        Candidate Resume:
        {user_resume[:3000]}
        
        Output ONLY a single integer between 1 and 100 representing the match percentage. Do not output any other text or reasoning.
        """
        
        try:
            response = await self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=10
            )
            
            result_text = response.choices[0].message.content.strip()
            # Extract just the numbers
            numbers = re.findall(r'\d+', result_text)
            if numbers:
                score = int(numbers[0])
                return max(1, min(100, score)) # Clamp between 1-100
            return 75
        except Exception as e:
            print(f"AI Scoring failed: {e}")
            return 75

apify_service = ApifyService()
