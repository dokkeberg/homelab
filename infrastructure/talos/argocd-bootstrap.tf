resource "kubernetes_namespace_v1" "argocd" {
  provider = kubernetes.bootstrap

  metadata {
    name = "argocd"
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
