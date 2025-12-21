#!/usr/bin/env bash

# Deploy Streaming App to k3s Kubernetes Cluster
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
IMAGE_NAME="streaming-app"
IMAGE_TAG="latest"

echo "🚀 Deploying Streaming App to k3s Kubernetes Cluster"
echo "=================================================="
echo ""

# Step 1: Build Docker image
echo "📦 Step 1: Building Docker image..."
cd "$PROJECT_DIR"
if ! docker images | grep -q "${IMAGE_NAME}:${IMAGE_TAG}"; then
    echo "Building image..."
    docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .
else
    echo "Image already exists, skipping build..."
fi
echo "✅ Docker image ready: ${IMAGE_NAME}:${IMAGE_TAG}"
echo ""

# Step 2: Import image into k3s
echo "📥 Step 2: Importing image into k3s..."
docker save "${IMAGE_NAME}:${IMAGE_TAG}" -o /tmp/streaming-app.tar
sudo k3s ctr images import /tmp/streaming-app.tar
rm -f /tmp/streaming-app.tar
echo "✅ Image imported into k3s"
echo ""

# Step 3: Deploy to Kubernetes
echo "🚀 Step 3: Deploying to Kubernetes..."
cd "$SCRIPT_DIR"

echo "Creating namespace..."
sudo kubectl apply -f streaming-namespace.yaml

echo "Creating deployment..."
sudo kubectl apply -f streaming-deployment.yaml

echo "Creating service..."
sudo kubectl apply -f streaming-service.yaml

echo ""
echo "✅ Deployment complete!"
echo ""

# Step 4: Wait for pod to be ready
echo "⏳ Waiting for pod to be ready..."
sleep 5
sudo kubectl wait --for=condition=ready pod -l app=streaming-app -n streaming --timeout=60s || true

# Step 5: Show status
echo ""
echo "📊 Deployment Status:"
echo "===================="
sudo kubectl get pods -n streaming
echo ""
sudo kubectl get svc -n streaming
echo ""

# Step 6: Show access information
NODE_PORT=$(sudo kubectl get svc -n streaming streaming-app -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null || echo "30086")
echo "🌐 Access Information:"
echo "======================"
echo "NodePort: http://<node-ip>:${NODE_PORT}"
echo ""
echo "To find your node IP:"
echo "  sudo kubectl get nodes -o wide"
echo ""
echo "📝 Useful Commands:"
echo "=================="
echo "View logs:        sudo kubectl logs -n streaming -l app=streaming-app -f"
echo "Check status:     sudo kubectl get all -n streaming"
echo "Delete deployment: sudo kubectl delete -f $SCRIPT_DIR/"
echo ""
