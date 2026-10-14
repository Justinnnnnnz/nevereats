import os

from pydantic import BaseModel


class Settings(BaseModel):
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://nevereats:nevereats@localhost:5432/nevereats",
    )
    web_origins: list[str] = os.getenv("WEB_ORIGINS", "http://localhost:3000").split(
        ","
    )


settings = Settings()
