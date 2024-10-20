from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import api

app = FastAPI(title="Rule Engine API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Rule Engine API is running"}