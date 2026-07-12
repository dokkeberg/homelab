# Homelab

This repository defines a Kubernetes homelab running on Talos Linux VMs in Proxmox. OpenTofu bootstraps the cluster and its foundational services; Argo CD continuously reconciles the remaining application manifests from Git.

The legacy k3s and Ansible configuration remains under `infrastructure/ansible/` during the migration. New infrastructure work belongs in the Talos and Argo CD configuration.

## Layout

| Path | Purpose |
| --- | --- |
| `infrastructure/talos/` | OpenTofu for Proxmox VMs, Talos bootstrap, Cilium, bootstrap secrets, and Argo CD |
| `infrastructure/talos/README.md` | Talos OpenTofu and optional VPN gateway operations |
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

Envoy Gateway exposes HTTPS through a Cilium LoadBalancer Service. Configure the UniFi wildcard DNS record for `*.talos.home` to the Gateway LoadBalancer address, not to a Talos worker IP. The Cilium pool reserves `192.168.1.224/32` for the Gateway; reserve that address outside the UniFi DHCP pool.

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

## Servarr bootstrap checklist (per app)

Most Servarr apps require first-run configuration in the app UI after deployment.

### SABnzbd

1. Start with a port-forward so you can open SAB before hostname whitelist is configured:
   ```powershell
   kubectl -n sabnzbd port-forward svc/sabnzbd 8080:8080
   ```
2. Open `http://localhost:8080`.
3. Set **Config > Special > `host_whitelist`** to include:
   - `sabnzbd.talos.home`
   - `sabnzbd.sabnzbd`
   - `sabnzbd.sabnzbd.svc.cluster.local`
4. Register Usenet provider credentials (for example NewsDemon): server, port, username, password, SSL.
5. Set download folders:
   - **Completed Download Folder**: `/downloads`
   - **Temporary Download Folder**: `/downloads-incomplete`
6. After bootstrap, use `https://sabnzbd.talos.home`.

### Prowlarr

1. Add indexers and API keys (for example **NZBFinder** with URL `https://nzbfinder.ws` and your NZBFinder API key).
2. Register **Sonarr** app in Prowlarr with:
   - Prowlarr URL: `http://prowlarr.prowlarr.svc.cluster.local:9696`
   - Sonarr URL: `http://sonarr.sonarr.svc.cluster.local:8989`
   - Sonarr API key
3. Register **Radarr** app in Prowlarr with:
   - Prowlarr URL: `http://prowlarr.prowlarr.svc.cluster.local:9696`
   - Radarr URL: `http://radarr.radarr.svc.cluster.local:7878`
   - Radarr API key
4. Keep UI access via `https://prowlarr.talos.home`.

### Sonarr

1. In **Media Management**, set root folder to `/tv`.
2. Add SABnzbd as Download Client.
3. Set Host to `sabnzbd.sabnzbd.svc.cluster.local`.
4. Set Port to `8080`.
5. Disable SSL for this SAB Download Client entry.
6. Set SAB API key.

### Radarr

1. In **Media Management**, set root folder to `/movies`.
2. Add SABnzbd as Download Client.
3. Set Host to `sabnzbd.sabnzbd.svc.cluster.local`.
4. Set Port to `8080`.
5. Disable SSL for this SAB Download Client entry.
6. Set SAB API key.

### Plex

1. Generate a temporary claim token from `https://www.plex.tv/claim`.
2. In Argo CD GUI, open **Applications > plex > Parameters**, add `plex.claim=<claim-token>`, and sync the app.
3. Complete Plex claim in the web UI, then remove `plex.claim` again and sync once more.
4. Add libraries from `/data/movies` and `/data/tv`.

### qBittorrent

1. Complete first login and set permanent WebUI credentials.
2. Verify category/save paths for `/downloads`, `/downloads-incomplete`, and `/seed`.
3. Use `https://qbittorrent.talos.home`.
