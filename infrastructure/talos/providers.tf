terraform {
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "0.109.0"
    }
    talos = {
      source  = "siderolabs/talos"
      version = "0.12.0-alpha.4"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "3.2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "3.2.0"
    }
  }
}

provider "kubernetes" {
  alias       = "bootstrap"
  config_path = "${path.module}/kubeconfig"
}

provider "helm" {
  alias = "bootstrap"

  kubernetes = {
    config_path = "${path.module}/kubeconfig"
  }
}
