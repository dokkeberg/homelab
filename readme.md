## Homelab
This will publish a ready to go homelab setup using cloud init images on a proxmox host. The following applications and features will be installed and ready to use on your *.k3s.home local domain:
* ArgoCD
* Cert-manager
* Portainer
* SemaphoreUI 
* Keycloak

Using traefik and cert-manager, we get https ingress, with automatically self signed certificates using a self signed root CA. 

To be added later:
* OIDC on all services using keycloak
* SemaphoreUI preconfigured

### proxmox
A computer with proxmox installed is required. Do the following to deploy:
* apt install git 
* apt install ansible
* Clone this repo
* Run ansible playbook to create a ubuntu-server cloudinit VM template, and create a VM with k3s installed, and argo/portainer/cert-manager/keycloak/semaphoreui stack deployed
  ```
  ansible-playbook -i inventory.ini playbooks/ubuntu-server-cloudinit.yaml --extra-vars "VMID_instance=101"
  ```

### Router
Add local DNS entries
* *.k3s.home (192.168.1.100, or the configured IP of the VM)

### ArgoCD

> [!NOTE]  
> Using traefik ingress requires argocd to be run in insecure mode. This should be safe as traefik terminates https.

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
* Change the following parameter in the infrastructure chart to the adminpw. This will allow the keyvault cli to create the initial realm and user
  ```
  spec.keycloak.adminPassword
  ```
* Login with user:\<adminpw\>
* Create a new permanent adminuser as soon as possible, and delete the "user" user
* Login to the home realm with your new user https://keycloak.k3s.home/realms/home/account and change from initialpassword


## Nice to have commands

Patch PersistentVolume to be able to be reclaimed
```
kubectl patch pv plex-movies-pv -p '{"spec":{"claimRef": null}}'
```