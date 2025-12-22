# Streaming App Kubernetes Deployment

This deployment sets up the Sports Stream Viewer app in your Kubernetes cluster.

## Prerequisites

1. Kubernetes cluster with kubectl configured
2. Nginx Ingress Controller (if using ingress)
3. Docker image built and available to the cluster

## Building the Docker Image

You have a few options for making the Docker image available:

### Option 1: Build and Load into Kind/Minikube (Local Clusters)

If using Kind or Minikube:
```bash
cd /home/server/streaming

# For Kind
kind load docker-image streaming-app:latest

# For Minikube
minikube image load streaming-app:latest
```

### Option 2: Use Local Registry

If you have a local Docker registry:
```bash
cd /home/server/streaming
docker build -t local-registry:5000/streaming-app:latest .
docker push local-registry:5000/streaming-app:latest
```

Then update `streaming-deployment.yaml` to use:
```yaml
image: local-registry:5000/streaming-app:latest
```

### Option 3: Build in Kubernetes (using Kaniko or BuildKit)

You can use a build job to build the image in-cluster.

### Option 4: Push to Public/Private Registry

```bash
cd /home/server/streaming
docker build -t your-registry/streaming-app:latest .
docker push your-registry/streaming-app:latest
```

Then update `streaming-deployment.yaml` to use your registry image.

## Deployment Steps

1. **Create namespace:**
```bash
kubectl apply -f streaming-namespace.yaml
```

2. **Deploy the application:**
```bash
kubectl apply -f streaming-deployment.yaml
kubectl apply -f streaming-service.yaml
```

3. **Optional - Deploy ingress (if using domain):**
```bash
# Edit streaming-ingress.yaml and replace streaming.yourdomain.com with your domain
kubectl apply -f streaming-ingress.yaml
```

## Access

- **NodePort**: Access via any node IP on port `30080`
  - Example: `http://<node-ip>:30080`
  
- **Ingress**: If configured, access via your domain
  - Example: `http://streaming.yourdomain.com`

## Verify Deployment

```bash
# Check pods
kubectl get pods -n streaming

# Check service
kubectl get svc -n streaming

# Check logs
kubectl logs -n streaming -l app=streaming-app

# Get pod details
kubectl describe pod -n streaming -l app=streaming-app
```

## Update Deployment

To update the app after making changes:

1. Rebuild the Docker image
2. Update the image in your registry/local cluster
3. Restart the deployment:
```bash
kubectl rollout restart deployment/streaming-app -n streaming
```

Or delete the pod to force a new one:
```bash
kubectl delete pod -n streaming -l app=streaming-app
```

## Resource Limits

The deployment is configured with:
- **Requests**: 128Mi memory, 100m CPU
- **Limits**: 512Mi memory, 500m CPU

Adjust these in `streaming-deployment.yaml` if needed.

## Troubleshooting

If the pod fails to start:
```bash
# Check pod status
kubectl get pods -n streaming

# View logs
kubectl logs -n streaming -l app=streaming-app

# Describe pod for events
kubectl describe pod -n streaming -l app=streaming-app
```

Common issues:
- **ImagePullBackOff**: Image not found - ensure image is available to cluster
- **CrashLoopBackOff**: Check logs for application errors
- **Port conflicts**: Change nodePort in service if 30080 is already in use


