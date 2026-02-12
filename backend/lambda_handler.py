"""
AWS Lambda handler using Mangum adapter for FastAPI
"""
from mangum import Mangum
from main import app

# Lambda handler
handler = Mangum(app, lifespan="off")
