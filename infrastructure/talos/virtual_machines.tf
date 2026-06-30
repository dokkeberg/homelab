resource "proxmox_virtual_environment_vm" "talos_cp" {
    name = "talos-cp"
    node_name = "cad-server"
    on_boot = true

    cpu {
        cores = 2
        type = "x86-64-v2-AES"
    }

    memory {
        dedicated = 4096
    }

    agent {
        enabled = true
    }

    network_device {
        bridge = "vmbr0"
    }

    disk {
        datastore_id = "local-lvm"
        file_id = proxmox_download_file.talos_nocloud_image.id
        file_format = "raw"
        size = 20
        interface = "virtio0"
    }

    initialization {
        datastore_id = "local-lvm"
        ip_config {
            ipv4 {
                address = "${var.talos_cp_ip_address}/24"
                gateway = var.default_gateway
            }
            ipv6 {
                address = "dhcp"
            }
        }
    }

    operating_system {
        type = "l26"
    }
}

resource "proxmox_virtual_environment_vm" "talos_worker" {
    name = "talos-worker"
    node_name = "cad-server"
    on_boot = true

    cpu {
        cores = 4
        type = "x86-64-v2-AES"
    }

    memory {
        dedicated = 16384
    }

    agent {
        enabled = true
    }

    network_device {
        bridge = "vmbr0"
    }

    disk {
        datastore_id = "local-lvm"
        file_id = proxmox_download_file.talos_nocloud_image.id
        file_format = "raw"
        size = 40
        interface = "virtio0"
    }

    initialization {
        datastore_id = "local-lvm"
        ip_config {
            ipv4 {
                address = "${var.talos_worker_ip_address}/24"
                gateway = var.default_gateway
            }
            ipv6 {
                address = "dhcp"
            }
        }
    }

    operating_system {
        type = "l26"
    }
}