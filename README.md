# 🚀 MCP API Gateway: Cloud-Native DevOps Control Plane

A complete, production-grade DevOps and Site Reliability Engineering (SRE) playground. This project demonstrates a full GitOps-driven microservice architecture, starting from a local Kubernetes development environment and scaling up to AWS EKS Infrastructure-as-Code (IaC).

**Architectural Focus:** This project prioritizes complex infrastructure routing, CI/CD automation, stateful data management, and full-stack observability over heavy machine learning compute, utilizing lightweight mock services to represent AI model routing.

## 🏗️ Architecture & Tech Stack

This environment bridges application development with production-grade infrastructure:

* **Microservices:** Node.js (Auth Service) & Python/FastAPI (Model Routing Service)
* **Containerization & Orchestration:** Docker, local Kubernetes (Docker Desktop/Kind)
* **API Gateway & Edge Routing:** NGINX Ingress Controller
* **Stateful Data Layer:** PostgreSQL & Redis (Deployed via Bitnami Helm Charts)
* **GitOps Continuous Deployment:** ArgoCD
* **Continuous Integration:** GitHub Actions
* **Observability & SRE:** Prometheus & Grafana (kube-prometheus-stack)
* **Infrastructure as Code (IaC):** Terraform (AWS VPC & EKS - Dry Run/LocalStack ready)

## 📁 Repository Structure

```text
mcp-devops-lab/
├── .github/workflows/   # CI Pipeline for automated syntax testing
├── auth-service/        # Node.js authentication microservice
├── model-service/       # Python FastAPI mock AI routing service
├── k8s/                 # Kubernetes manifests (The GitOps Source of Truth)
│   ├── 01-namespace.yaml
│   ├── 02-auth-deployment.yaml
│   ├── 03-model-deployment.yaml
│   └── 04-ingress.yaml
└── terraform/           # AWS EKS & VPC Infrastructure as Code
    ├── main.tf
    └── providers.tf

# Start the API Gateway Ingress
kubectl apply -f [https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml](https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml)

# Create the Data Namespace
kubectl create namespace mcp-data

# Deploy Redis Cache & PostgreSQL
helm install mcp-redis bitnami/redis --namespace mcp-data --set architecture=standalone --set auth.enabled=false
helm install mcp-postgres bitnami/postgresql --namespace mcp-data --set auth.postgresPassword=mcpadmin --set auth.database=mcpdb

# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f [https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml](https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml)

# Extract Admin Password
$EncodedPassword = kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}"
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($EncodedPassword))

# Open UI Tunnel (Access at https://localhost:8080)
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Install Monitoring Stack
kubectl create namespace monitoring
helm install mcp-monitoring prometheus-community/kube-prometheus-stack --namespace monitoring

# Extract Grafana Admin Password
$EncodedGrafanaPass = kubectl get secret mcp-monitoring-grafana -n monitoring -o jsonpath="{.data.admin-password}"
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($EncodedGrafanaPass))

# Open UI Tunnel (Access at http://localhost:3000)
kubectl port-forward svc/mcp-monitoring-grafana -n monitoring 3000:80