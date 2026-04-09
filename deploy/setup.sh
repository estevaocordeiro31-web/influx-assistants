#!/bin/bash
set -e

echo "=== Deploy inFlux Tutor ==="

BRAIN_ENV="/var/www/brain/.env"
TUTOR_DIR="/var/www/influx-tutor"

cd "$TUTOR_DIR"

# Extrair chaves do .env do BRAiN
get_brain_var() {
  grep "^$1=" "$BRAIN_ENV" | tail -1 | cut -d'=' -f2-
}

OPENAI_KEY=$(get_brain_var "OPENAI_API_KEY")
ELEVENLABS_KEY=$(get_brain_var "ELEVENLABS_API_KEY")
JWT=$(get_brain_var "JWT_SECRET")
DB_URL=$(get_brain_var "DATABASE_URL")

echo "[1/6] Criando .env (chaves extraídas do BRAiN)..."
cat > .env << ENVEOF
NODE_ENV=production
PORT=3003

DATABASE_URL=$DB_URL
CENTRAL_DATABASE_URL=$DB_URL

JWT_SECRET=$JWT
VITE_APP_ID=influx-tutor

OPENAI_API_KEY=$OPENAI_KEY
GEMINI_API_KEY=
ELEVENLABS_API_KEY=$ELEVENLABS_KEY
GOOGLE_CLOUD_TTS_API_KEY=

SPONTE_LOGIN=
SPONTE_PASSWORD=
SPONTE_API_URL=https://api.sponte.com.br

WEBHOOK_SECRET=tutor_webhook_2026
APP_BASE_URL=https://tutor.imaind.tech
ENVEOF

echo "[2/6] Build..."
npm run build

echo "[3/6] Criando diretório uploads..."
mkdir -p uploads

echo "[4/6] Configurando PM2..."
pm2 delete influx-tutor 2>/dev/null || true
pm2 start dist/index.js --name influx-tutor
pm2 save

echo "[5/6] Configurando nginx..."
cp deploy/nginx.conf /etc/nginx/sites-available/influx-tutor
ln -sf /etc/nginx/sites-available/influx-tutor /etc/nginx/sites-enabled/influx-tutor
nginx -t && systemctl reload nginx

echo "[6/6] SSL..."
certbot --nginx -d tutor.imaind.tech --non-interactive --agree-tos --email admin@imaind.tech || echo "SSL: rode manualmente: certbot --nginx -d tutor.imaind.tech"

echo ""
echo "=== Deploy completo! ==="
echo "Acesse: https://tutor.imaind.tech"
