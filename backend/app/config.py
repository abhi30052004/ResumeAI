from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    OPENAI_API_KEY: str
    JWT_SECRET: str
    APIFY_API_TOKEN: str
    FRONTEND_URL: str = "http://localhost:5173"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
