resource "kubernetes_namespace_v1" "argocd" {
  provider = kubernetes.bootstrap

  metadata {
    name = "argocd"
  }

  depends_on = [local_file.kubeconfig]
}

resource "helm_release" "cilium" {
  provider = helm.bootstrap
  name       = "cilium"
  namespace  = "kube-system"
  repository = "https://helm.cilium.io/"
  chart      = "cilium"
  version    = "1.19.5"

  create_namespace = true

  values = [
    file("${path.module}/cilium-values.yaml")
  ]

  depends_on = [local_file.kubeconfig]
}

resource "kubernetes_manifest" "cilium_lb_pool" {
  provider = helm.bootstrap
  manifest = {
    apiVersion = "cilium.io/v2alpha1"
    kind       = "CiliumLoadBalancerIPPool"
    metadata = {
      name = "homelab-ip-pool"
    }
    spec = {
      cidrs = [
        {
          cidr = "10.0.1.200/29"
        }
      ]
    }
  }
  depends_on = [local_file.kubeconfig]
}

resource "kubernetes_manifest" "cilium_l2_policy" {
  provider = helm.bootstrap
  manifest = {
    apiVersion = "cilium.io/v2alpha1"
    kind       = "CiliumL2AnnouncementPolicy"
    metadata = {
      name = "homelab-l2"
    }
    spec = {
      loadBalancerIPs = true
      interfaces      = ["eth0"]
    }
  }
  depends_on = [local_file.kubeconfig]
}




resource "helm_release" "argocd" {
  provider = helm.bootstrap

  name       = "argocd"
  namespace  = kubernetes_namespace_v1.argocd.metadata[0].name
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  version    = "9.5.21"

  values = [
    file("${path.module}/argocd-bootstrap-values.yaml")
  ]

  depends_on = [local_file.kubeconfig]
}
