# Repository Guidance

## Deployment model

- Treat Git as the source of truth. Make Kubernetes changes through OpenTofu or Argo CD manifests, not imperative `kubectl` mutations.
- Read-only `kubectl get`, `describe`, and log queries are permitted for diagnosis. Ask before performing any cluster mutation needed for exceptional recovery.
- OpenTofu in `infrastructure/talos/` owns Talos, Proxmox VMs, Cilium, bootstrap namespaces and secrets, and bootstrap Argo CD.
- The `infrastructure` app-of-apps owns child Argo CD Applications. Application workloads belong under `infrastructure/applications/` or `servarr/`.

## Ordering and ownership

- Cilium must be installed before Argo CD and bootstrap namespaces, and destroyed after them.
- Add `resources-finalizer.argocd.argoproj.io` to Argo CD Applications that manage workloads so deletion cascades before their namespace is removed.
- Gateway API CRDs are owned by `gateway-api-crds`. Envoy Gateway's controller chart must skip CRDs and disable its Gateway API safe-upgrade policy when those resources are managed separately.
- Keep Cilium pod CIDRs separate from node and LAN ranges. The configured cluster-pool CIDR is `10.244.0.0/16`.

## Secrets and local state

- Never commit secrets, `.env` files, `*.tfstate`, generated kubeconfigs, private keys, or credentials.
- OpenTofu commands require environment variables set in the operator's terminal. Do not run OpenTofu commands unless those variables are available and the operator has approved the command.
- Use sensitive OpenTofu variables for bootstrap credentials and avoid printing their values.

## Validation

- Prefer local rendering such as `helm template` for Argo Helm charts.
- Check YAML and HCL changes for formatting and syntax without accessing live state unless explicitly approved.
- Preserve user changes in a dirty worktree; do not reset, revert, or overwrite unrelated edits.
