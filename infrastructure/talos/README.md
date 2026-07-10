# Talos OpenTofu

## VPN gateway

The optional VPN gateway routes external traffic from both Talos nodes through
ExpressVPN OpenVPN while leaving traffic to the local `192.168.1.0/24` network
direct. The gateway VM uses `192.168.1.225`, and source-NATs only
`talos-cp` (`192.168.1.222`) and `talos-worker` (`192.168.1.223`) through
`tun0`.

The gateway blocks forwarded Talos traffic when `tun0` is unavailable. This
prevents a VPN failure from falling back to the normal WAN connection.

### Prerequisites

- The `local` Proxmox datastore must have the `Snippets` content type enabled.
  Enable it in **Datacenter > Storage > local > Edit > Content**. OpenTofu
  stores the generated cloud-init file as
  `local:snippets/vpn-gateway-cloud-init.yaml`.
- Obtain the ExpressVPN manual OpenVPN username, password, and `.ovpn` profile.
  Do not use the normal ExpressVPN account password.
- Keep the `.ovpn` profile and credentials outside Git. The profile is ignored
  by `.gitignore`, and OpenTofu input variables are sensitive.

### Provision and test

In the same terminal used for OpenTofu, set the sensitive VPN inputs and enable
only gateway provisioning:

```powershell
$env:TF_VAR_expressvpn_openvpn_profile = Get-Content -Raw 'C:\path\expressvpn.ovpn'
$env:TF_VAR_expressvpn_username = '<OpenVPN username>'
$env:TF_VAR_expressvpn_password = '<OpenVPN password>'
$env:TF_VAR_enable_vpn_gateway = 'true'
$env:TF_VAR_route_talos_through_vpn = 'false'

tofu plan
tofu apply
```

OpenTofu downloads Ubuntu 24.04 Cloud Image, creates the managed
`vpn-gateway-ubuntu-2404-template`, then clones the gateway VM from it. Verify
the gateway before changing Talos routing:

```bash
ip addr show tun0
systemctl status openvpn-client@expressvpn
curl -4 https://api.ipify.org; echo
```

The public address must be an ExpressVPN address and `tun0` must be up.

### Route Talos through the gateway

After verification, retain the variables above and set:

```powershell
$env:TF_VAR_route_talos_through_vpn = 'true'

tofu plan
tofu apply
```

This changes both Talos nodes' IPv4 default route to `192.168.1.225` and
disables their DHCP IPv6 configuration to prevent egress outside the VPN.

### Verify pod egress

All pods scheduled on `talos-cp` or `talos-worker` use the VPN for external
IPv4 traffic. Cilium source-NATs pod egress to the node address, and the
gateway permits and NATs only the two Talos node addresses through `tun0`.
Traffic to the local `192.168.1.0/24` network remains direct.

Verify the public egress address from a pod:

```powershell
kubectl -n qbittorrent exec statefulset/qbittorrent -- `
  curl -s https://ipinfo.io/json
```

The returned address must match the gateway's VPN address:

```bash
curl -4 https://api.ipify.org; echo
```

When adding another Talos node, add its IP address to the gateway's nftables
allow and masquerade rules, and configure its IPv4 default route to
`192.168.1.225`.

### Gateway profile recovery

If a corrected `.ovpn` profile requires the gateway to be rebuilt while the
Kubernetes API is unavailable, use a targeted apply to avoid refreshing
Kubernetes resources:

```powershell
tofu apply `
  -target='proxmox_virtual_environment_file.vpn_gateway_user_data[0]' `
  -target='proxmox_virtual_environment_vm.vpn_gateway[0]' `
  -replace='proxmox_virtual_environment_vm.vpn_gateway[0]'
```
