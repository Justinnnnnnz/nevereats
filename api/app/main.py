from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

app = FastAPI(title="NeverEats API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.web_origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Content-Type", "X-Guest-Id"],
)


@app.get("/v1/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
