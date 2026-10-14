import os

from pydantic import BaseModel


class Settings(BaseModel):
    hst_percent: int = int(os.getenv("HST_PERCENT", "13"))
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://nevereats:nevereats@localhost:5432/nevereats",
    )
    web_origins: list[str] = os.getenv("WEB_ORIGINS", "http://localhost:3000").split(
        ","
    )


settings = Settings()
