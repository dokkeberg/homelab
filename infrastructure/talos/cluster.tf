resource "talos_machine_secrets" "machine_secrets" {}

data "talos_client_configuration" "talosconfig" {
  cluster_name         = var.cluster_name
  client_configuration = talos_machine_secrets.machine_secrets.client_configuration
  endpoints            = [var.talos_cp_ip_address]
}

data "talos_machine_configuration" "machineconfig_cp" {
  cluster_name     = var.cluster_name
  cluster_endpoint = "https://${var.talos_cp_ip_address}:6443"
  machine_type     = "controlplane"
  machine_secrets  = talos_machine_secrets.machine_secrets.machine_secrets
  talos_version    = var.talos_version
}

resource "talos_machine_configuration_apply" "cp_config_apply" {
  depends_on                  = [ proxmox_virtual_environment_vm.talos_cp ]
  client_configuration        = talos_machine_secrets.machine_secrets.client_configuration
  machine_configuration_input = data.talos_machine_configuration.machineconfig_cp.machine_configuration
  count                       = 1
  node                        = var.talos_cp_ip_address
}

data "talos_machine_configuration" "machineconfig_worker" {
  cluster_name     = var.cluster_name
  cluster_endpoint = "https://${var.talos_cp_ip_address}:6443"
  machine_type     = "worker"
  machine_secrets  = talos_machine_secrets.machine_secrets.machine_secrets
  talos_version    = var.talos_version
}

resource "talos_machine_configuration_apply" "worker_config_apply" {
  depends_on                  = [ proxmox_virtual_environment_vm.talos_worker ]
  client_configuration        = talos_machine_secrets.machine_secrets.client_configuration
  machine_configuration_input = data.talos_machine_configuration.machineconfig_worker.machine_configuration
  count                       = 1
  node                        = var.talos_worker_ip_address
}

resource "talos_machine_bootstrap" "bootstrap" {
  depends_on           = [ talos_machine_configuration_apply.cp_config_apply ]
  client_configuration = talos_machine_secrets.machine_secrets.client_configuration
  node                 = var.talos_cp_ip_address
}

data "talos_cluster_health" "health" {
  depends_on           = [ talos_machine_configuration_apply.cp_config_apply, talos_machine_configuration_apply.worker_config_apply ]
  client_configuration = data.talos_client_configuration.talosconfig.client_configuration
  control_plane_nodes  = [ var.talos_cp_ip_address ]
  worker_nodes         = [ var.talos_worker_ip_address ]
  endpoints            = data.talos_client_configuration.talosconfig.endpoints
}

data "talos_cluster_kubeconfig" "kubeconfig" {
  depends_on           = [ talos_machine_bootstrap.bootstrap, data.talos_cluster_health.health ]
  client_configuration = talos_machine_secrets.machine_secrets.client_configuration
  node                 = var.talos_cp_ip_address
}

output "talosconfig" {
  value = data.talos_client_configuration.talosconfig.talos_config
  sensitive = true
}

output "kubeconfig" {
  value     = data.talos_cluster_kubeconfig.kubeconfig.kubeconfig_raw
  sensitive = true
}

resource "local_file" "kubeconfig" {
  depends_on = [data.talos_cluster_kubeconfig.kubeconfig]
  content    = data.talos_cluster_kubeconfig.kubeconfig.kubeconfig_raw
  filename   = "${path.module}/kubeconfig"
}

resource "kubernetes_namespace_v1" "cert_manager" {
  provider = kubernetes.bootstrap

  metadata {
    name = "cert-manager"
  }
}

resource "kubernetes_secret_v1" "home_root_ca" {
  provider = kubernetes.bootstrap
  depends_on = [local_file.kubeconfig]

  metadata {
    name      = "home-root-ca-secret"
    namespace = "cert-manager"
  }

  data = {
    "tls.crt" = var.root_ca_crt
    "tls.key" = var.root_ca_key
  }

  type = "kubernetes.io/tls"
  
  lifecycle {
    ignore_changes = [
      metadata[0].annotations,
      metadata[0].labels,
      type
    ]
  }
}

resource "random_password" "cnpg_password" {
  length  = 32
  special = false
}

resource "kubernetes_namespace_v1" "cnpg" {
  provider = kubernetes.bootstrap
  
  metadata {
    name = "cnpg"
  }
}

resource "kubernetes_namespace_v1" "keycloak_operator" {
  provider = kubernetes.bootstrap

  metadata {
    name = "keycloak-operator"
  }
}

resource "kubernetes_secret_v1" "cnpg_cluster_password" {
  provider = kubernetes.bootstrap
  depends_on = [kubernetes_namespace_v1.cnpg]

  metadata {
    name      = "cnpg-cluster-password"
    namespace = "cnpg"
  }

  data = {
    username = "app"
    password = random_password.cnpg_password.result
  }

  type = "Opaque"
}

resource "kubernetes_secret_v1" "keycloak_cluster_password" {
  provider = kubernetes.bootstrap
  
  depends_on = [kubernetes_namespace_v1.keycloak_operator]

  metadata {
    name      = "cnpg-cluster-password"
    namespace = "keycloak-operator"
  }

  data = {
    username = "app"
    password = random_password.cnpg_password.result
  }

  type = "Opaque"
}

locals {
  ssh_key_indented = join("\n", [
    for line in split("\n", trimspace(var.democratic_ssh_key)) :
    "        ${line}"
  ])

  democratic_csi_nfs_yaml_raw = templatefile("${path.module}/democratic-csi-nfs.yaml.tmpl", {
    api_key          = trimspace(var.democratic_api_key)
    ssh_key_indented = local.ssh_key_indented
  })

  democratic_csi_nfs_yaml = replace(local.democratic_csi_nfs_yaml_raw, "\r\n", "\n")
  democratic_csi_nfs_b64 = local.democratic_csi_nfs_yaml
}

resource "kubernetes_secret_v1" "democratic_csi_nfs" {
  provider = kubernetes.bootstrap

  metadata {
    name      = "democratic-csi-nfs-secret"
    namespace = "democratic-csi"
  }

  data = {
    "driver-config-file.yaml" = local.democratic_csi_nfs_b64
  }

  type = "Opaque"
}






