from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import json
import os
import uvicorn

app = FastAPI()

# Configuração de CORS para o React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

USERS_FILE = "users.json"

class UserSchema(BaseModel):
    name: str = None
    email: EmailStr
    password: str

# Garante que o arquivo JSON existe
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w") as f:
        json.dump([], f)

def load_users():
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)

@app.post("/register")
def register(user: UserSchema):
    users = load_users()
    if any(u['email'] == user.email for u in users):
        raise HTTPException(status_code=400, detail="E-mail já cadastrado!")
    
    users.append(user.dict())
    save_users(users)
    return {"message": "Conta criada com sucesso!"}

@app.post("/login")
def login(user: UserSchema):
    users = load_users()
    found = next((u for u in users if u['email'] == user.email and u['password'] == user.password), None)
    
    if not found:
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos")
    
    return {
        "message": "Login realizado!",
        "user": {"name": found.get('name'), "email": found['email']}
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)