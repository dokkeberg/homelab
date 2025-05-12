### k3s
* Setup new VM using ubuntu-server
  * Enable SSH during install
  * Remove install drive after reboot
* Install k3s on ubuntu VM
* Handle KUBECONFIG and export it in bash profile
* Install helm

Add local DNS entries in router
* *.k3s.home
* k3s.home

### ArgoCD

> [!NOTE]  
> Using traefik ingress requires argocd to be run in insecure mode. This should be safe as traefik terminates https.

* Follow installation instructions
* Install argocd cli tool
* Temporarily expose argocd
  ```
  kubectl port-forward svc/argocd-server -n argocd 8080:443
  ```
* Login using initial password and admin user
  ```
  argocd admin initial-password -n argocd
  ```
  ```
  argocd login --port-forward --port-forward-namespace argocd --plaintext
  ```
* Update password of admin user
  ```
  argocd account update-password --port-forward-namespace argocd
  ```
* Delete initial admin password resource
  ```
  kubectl delete secret argocd-initial-admin-secret -n argocd
  ```
* Install infrastructure app-of-apps
  ```
  argocd admin initial-password -n argocd
  ```
  ```
  argocd app create infrastructure --repo https://github.com/dokkeberg/homelab --path infrastructure/applications/app-of-apps --dest-server https://kubernetes.default.svc --dest-namespace argocd --plaintext --insecure --port-forward-namespace argocd

  ```
* Sync applications to create resources
  ```
  argocd app sync infrastructure --port-forward-namespace argocd --insecure --plaintext
  ```
* Verify that the following webpages are reachable from your network
  * https://argocd.k3s.home/
  * https://portainer.k3s.home/