resource "random_password" "argocd_oidc_client_secret" {
  length  = 32
  special = false
}

resource "kubernetes_namespace_v1" "democratic_csi" {
  provider = kubernetes.bootstrap
  metadata {
    name = "democratic-csi"

    labels = {
      "pod-security.kubernetes.io/enforce" = "privileged"
      "pod-security.kubernetes.io/audit"   = "privileged"
      "pod-security.kubernetes.io/warn"    = "privileged"
    }
  }

  depends_on = [helm_release.cilium]
}

resource "kubernetes_manifest" "infrastructure_app" {
  provider = kubernetes.bootstrap
  manifest = {
    apiVersion = "argoproj.io/v1alpha1"
    kind       = "Application"
    metadata = {
      name      = "infrastructure"
      namespace = "argocd"
      finalizers = [
        "resources-finalizer.argocd.argoproj.io"
      ]
    }
    spec = {
      project = "default"
      destination = {
        server    = "https://kubernetes.default.svc"
        namespace = "argocd"
      }
      source = {
        repoURL        = "https://github.com/dokkeberg/homelab"
        path           = "infrastructure/applications/app-of-apps"
        targetRevision = "HEAD"
        helm = {
          parameters = [
            {
              name  = "spec.keycloak.clients.argocd.clientSecret"
              value = random_password.argocd_oidc_client_secret.result
            }
          ]
        }

        depends_on = [
          helm_release.argocd,
          kubernetes_namespace_v1.cert_manager,
          kubernetes_namespace_v1.cnpg,
          kubernetes_namespace_v1.democratic_csi,
          kubernetes_namespace_v1.keycloak_operator,
          kubernetes_secret_v1.home_root_ca,
          kubernetes_secret_v1.cnpg_cluster_password,
          kubernetes_secret_v1.keycloak_cluster_password,
          kubernetes_secret_v1.democratic_csi_nfs,
        ]
      }
      syncPolicy = {
        automated = {
          prune    = true
          selfHeal = true
        }
      }
    }
  }
}
