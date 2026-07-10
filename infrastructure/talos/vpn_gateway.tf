locals {
  talos_default_gateway = var.route_talos_through_vpn ? var.vpn_gateway_ip_address : var.default_gateway
}

resource "proxmox_virtual_environment_file" "vpn_gateway_user_data" {
  count = var.enable_vpn_gateway ? 1 : 0

  content_type = "snippets"
  datastore_id = "local"
  node_name    = "cad-server"
  overwrite    = true

  source_raw {
    data = templatefile("${path.module}/templates/vpn-gateway-cloud-init.yaml.tftpl", {
      expressvpn_openvpn_profile = var.expressvpn_openvpn_profile
      expressvpn_username        = var.expressvpn_username
      expressvpn_password        = var.expressvpn_password
      talos_cp_ip_address        = var.talos_cp_ip_address
      talos_worker_ip_address    = var.talos_worker_ip_address
    })
    file_name = "vpn-gateway-cloud-init.yaml"
  }
}

resource "proxmox_download_file" "vpn_gateway_ubuntu_cloud_image" {
  content_type = "iso"
  datastore_id = "local"
  node_name    = "cad-server"
  file_name    = "noble-server-cloudimg-amd64.img"
  url          = "https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img"
}

resource "proxmox_virtual_environment_vm" "vpn_gateway_template" {
  name      = "vpn-gateway-ubuntu-2404-template"
  node_name = "cad-server"
  started   = false
  template  = true

  cpu {
    cores = 2
    type  = "x86-64-v2-AES"
  }

  memory {
    dedicated = 2048
  }

  disk {
    datastore_id = "local-lvm"
    file_id      = proxmox_download_file.vpn_gateway_ubuntu_cloud_image.id
    interface    = "virtio0"
    iothread     = true
    discard      = "on"
    size         = 20
  }

  initialization {
    datastore_id = "local-lvm"

    ip_config {
      ipv4 {
        address = "dhcp"
      }
    }
  }

  network_device {
    bridge = "vmbr0"
  }
}

resource "proxmox_virtual_environment_vm" "vpn_gateway" {
  count = var.enable_vpn_gateway ? 1 : 0

  name      = "vpn-gateway"
  node_name = "cad-server"
  on_boot   = true

  clone {
    vm_id = proxmox_virtual_environment_vm.vpn_gateway_template.id
  }

  cpu {
    cores = 2
    type  = "x86-64-v2-AES"
  }

  memory {
    dedicated = 2048
  }

  agent {
    enabled = true
  }

  network_device {
    bridge = "vmbr0"
  }

  initialization {
    datastore_id = "local-lvm"

    ip_config {
      ipv4 {
        address = "${var.vpn_gateway_ip_address}/24"
        gateway = var.default_gateway
      }
    }

    user_data_file_id = proxmox_virtual_environment_file.vpn_gateway_user_data[0].id
  }

  lifecycle {
    precondition {
      condition     = var.expressvpn_openvpn_profile != null && var.expressvpn_username != null && var.expressvpn_password != null
      error_message = "ExpressVPN OpenVPN profile, username, and password must be set when enable_vpn_gateway is true."
    }
  }
}
