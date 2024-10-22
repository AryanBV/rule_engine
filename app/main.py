from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .routes import api
import logging


# Create logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


# Create FastAPI instance



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

# Mount the static directory
app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/api")
async def root():
    return {"message": "Rule Engine API is running"}


# Note: The root ("/") route is now handled by the static files
# If you want a specific API endpoint for the root, use a different path, like "/api"