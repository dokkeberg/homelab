k3s
* Setup new VM using ubuntu-server
  * Enable SSH during install
  * Remove install drive after reboot
* Install k3s on ubuntu VM
* Handle KUBECONFIG and export it in bash profile
* Install helm

Add local DNS entries in router
* *.k3s.local
* k3s.local

ArgoCD
* Follow installation instructions
* Apply the following 
    ```
    kubectl patch configmap argocd-cmd-params-cm \
    -n argocd \
    --type merge \
    -p '{"data":{"server.insecure":"true"}}'
    ```
* Apply argocd-ingress.yml
