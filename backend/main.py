from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router as api_router
from database import init_db
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize indexes
    await init_db()
    yield
    # Shutdown

app = FastAPI(title="HRMS Lite API", lifespan=lifespan)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to HRMS Lite API"}
