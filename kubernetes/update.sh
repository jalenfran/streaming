#!/usr/bin/env bash

# Update Streaming App in Kubernetes
# This script rebuilds and redeploys after code changes

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
IMAGE_NAME="streaming-app"
IMAGE_TAG="latest"

echo "🔄 Updating Streaming App in Kubernetes"
echo "======================================"
echo ""

# Step 1: Pull latest code (if in git repo)
if [ -d "$PROJECT_DIR/.git" ]; then
    echo "📥 Pulling latest code..."
    cd "$PROJECT_DIR"
    git pull || echo "⚠️  Git pull failed or not a git repo, continuing..."
    echo ""
fi

# Step 2: Rebuild Docker image
echo "📦 Rebuilding Docker image..."
cd "$PROJECT_DIR"
docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .
echo "✅ Docker image rebuilt"
echo ""

# Step 3: Import image into k3s
echo "📥 Importing image into k3s..."
docker save "${IMAGE_NAME}:${IMAGE_TAG}" -o /tmp/streaming-app.tar
sudo k3s ctr images import /tmp/streaming-app.tar
rm -f /tmp/streaming-app.tar
echo "✅ Image imported into k3s"
echo ""

# Step 4: Restart deployment to use new image
echo "🔄 Restarting deployment..."
sudo kubectl rollout restart deployment/streaming-app -n streaming
echo "✅ Deployment restart initiated"
echo ""

# Step 5: Wait for rollout
echo "⏳ Waiting for rollout to complete..."
sudo kubectl rollout status deployment/streaming-app -n streaming --timeout=60s || true
echo ""

# Step 6: Show status
echo "📊 Current Status:"
echo "=================="
sudo kubectl get pods -n streaming
echo ""

NODE_PORT=$(sudo kubectl get svc -n streaming streaming-app -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null || echo "30086")
echo "🌐 App is available at: http://<node-ip>:${NODE_PORT}"
echo ""


