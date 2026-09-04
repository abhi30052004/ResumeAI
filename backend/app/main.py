from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import settings
from .database import connect_to_mongo, close_mongo_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="Resume AI API",
    description="Backend API for AI Resume Improver",
    version="1.0.0",
    lifespan=lifespan
)

from .routes import auth, resume, analysis, user, dashboard, jobs, applications
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(analysis.router)
app.include_router(user.router)
app.include_router(dashboard.router)
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(applications.router, prefix="/api/applications", tags=["applications"])

@app.get("/")
async def root():
    return {"message": "Welcome to Resume AI API"}
