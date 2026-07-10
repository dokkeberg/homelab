# Homelab

This repository defines a Kubernetes homelab running on Talos Linux VMs in Proxmox. OpenTofu bootstraps the cluster and its foundational services; Argo CD continuously reconciles the remaining application manifests from Git.

The legacy k3s and Ansible configuration remains under `infrastructure/ansible/` during the migration. New infrastructure work belongs in the Talos and Argo CD configuration.

## Layout

| Path | Purpose |
| --- | --- |
| `infrastructure/talos/` | OpenTofu for Proxmox VMs, Talos bootstrap, Cilium, bootstrap secrets, and Argo CD |
| `infrastructure/applications/app-of-apps/` | Infrastructure Argo CD app-of-apps |
| `infrastructure/applications/` | Helm charts and manifests for infrastructure services |
| `servarr/` | Argo CD application configuration for the Servarr/yarr stack |

## Bootstrap

OpenTofu creates the Talos control plane and worker, then installs Cilium, its LoadBalancer IP pool and L2 policy, and Argo CD. The `infrastructure` Argo CD application subsequently reconciles the infrastructure app-of-apps.

Set the required OpenTofu environment variables in your terminal before running commands:

```powershell
Set-Location infrastructure\talos
tofu init
tofu apply -target=local_file.kubeconfig
tofu apply '-target=helm_release.argocd'
tofu apply
```

The first targeted apply creates the Talos VMs, bootstraps the cluster, and writes the generated kubeconfig. The second installs Cilium and Argo CD, including Argo CD's `Application` CRD. The full apply then creates the infrastructure app-of-apps. Kubernetes, Helm, and kubectl providers require the generated kubeconfig before they can manage cluster resources.

The generated `kubeconfig`, OpenTofu state, `.env` files, and credentials are intentionally ignored by Git.

## Networking and DNS

Cilium provides kube-proxy replacement, cluster-pool IPAM, LoadBalancer IPAM, and L2 announcements. Pod addresses use `10.244.0.0/16` to avoid overlapping the node networks.

Envoy Gateway exposes HTTPS through a Cilium LoadBalancer Service. Configure the UniFi wildcard DNS record for `*.talos.home` to the Gateway LoadBalancer address, not to a Talos worker IP. The current Cilium pool is `10.0.1.200/29`; confirm the assigned Gateway address after a rebuild before updating DNS.

Gateway API CRDs are managed by the `gateway-api-crds` Argo CD application. Envoy Gateway manages only its own CRDs and controller resources.

## Teardown

Destroy the cluster from the same terminal that has the required OpenTofu environment variables:

```powershell
Set-Location infrastructure\talos
tofu destroy
```

The dependency graph removes Argo CD applications and their managed workloads before namespaces and Cilium. Do not remove Cilium directly while application controllers or namespace finalizers remain.

## Access

Until Gateway routing is available, access Argo CD through a port forward and `argocd login`. Once Envoy Gateway is healthy, use `https://argocd.talos.home`.
