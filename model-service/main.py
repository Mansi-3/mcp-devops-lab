from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/generate")
def generate_response(prompt: dict):
    # Simulating an AI response without any actual ML compute
    return {
        "model": "mock-mcp-v1",
        "response": f"Processed routing for prompt: {prompt.get('text', 'empty')}"
    }