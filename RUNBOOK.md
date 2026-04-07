# 1. Start the API Gateway Ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml

# 2. Create the Data Namespace
kubectl create namespace mcp-data

# 3. Deploy Redis Cache
helm install mcp-redis bitnami/redis --namespace mcp-data --set architecture=standalone --set auth.enabled=false

# 4. Deploy PostgreSQL Database
helm install mcp-postgres bitnami/postgresql --namespace mcp-data --set auth.postgresPassword=mcpadmin --set auth.database=mcpdb

# 1. Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 2. Wait for it to be ready, then get the password
$EncodedPassword = kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}"
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($EncodedPassword))

# 3. Open the UI Tunnel (Leave this running)
kubectl port-forward svc/argocd-server -n argocd 8080:443

# 1. Install Prometheus & Grafana
kubectl create namespace monitoring
helm install mcp-monitoring prometheus-community/kube-prometheus-stack --namespace monitoring

# 2. Get the Grafana Password
$EncodedGrafanaPass = kubectl get secret mcp-monitoring-grafana -n monitoring -o jsonpath="{.data.admin-password}"
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($EncodedGrafanaPass))

# 3. Open the UI Tunnel (Leave this running)
kubectl port-forward svc/mcp-monitoring-grafana -n monitoring 3000:80