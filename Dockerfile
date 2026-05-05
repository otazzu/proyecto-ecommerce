FROM python:3.11-slim

# Instalar Node.js 20
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar e instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar e instalar dependencias de Node y construir frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE $PORT

CMD ["sh", "-c", "gunicorn wsgi --chdir ./src/ --bind 0.0.0.0:$PORT"]
