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

from .routes import auth, resume, analysis, user, dashboard, jobs, applications, admin
from .routes import chat as chat_router
from .routes import projects as projects_router
from .routes import clients as clients_router
from .routes import manager as manager_router
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://resume-ai-three-omega.vercel.app",
    ],
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
app.include_router(admin.router)
app.include_router(chat_router.router)
app.include_router(projects_router.router)
app.include_router(clients_router.router)
app.include_router(manager_router.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Resume AI API"}
