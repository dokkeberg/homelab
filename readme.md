### k3s
* Setup new VM using ubuntu-server
  * Enable SSH during install
  * Remove install drive after reboot
* Install k3s on ubuntu VM
* Handle KUBECONFIG and export it in bash profile
* Install helm

### Router
Add local DNS entries
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
  argocd app create infrastructure --repo https://github.com/dokkeberg/homelab --path infrastructure/applications/app-of-apps --dest-server https://kubernetes.default.svc --dest-namespace argocd --plaintext --insecure --port-forward-namespace argocd

  ```
* Sync applications to create resources
  ```
  argocd app sync infrastructure --port-forward-namespace argocd --insecure --plaintext
  ```
* Verify that the following webpages are reachable from your network
  * https://argocd.k3s.home/
  * https://portainer.k3s.home/
* Download the CA cert from your browser, and install in Trusted Root Authorities to get trusted access to all hosted services on *.k3s.home

### Portainer
> [!NOTE]
> The business edition (BE) is free for the first 3 nodes. Sign up here: https://www.portainer.io/take-3

### Keycloak
* Get adminuser password
  ```
  kubectl get secret keycloak -n keycloak -o jsonpath="{.data.admin-password}" | base64 --decode
  ```
* Login with user:\<adminpw\>
* Create a new permanent adminuser as soon as possible, and delete the "user" user