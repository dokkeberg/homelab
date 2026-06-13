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
}

resource "kubernetes_manifest" "infrastructure_app" {
  provider = kubernetes.bootstrap
  manifest = {
    apiVersion = "argoproj.io/v1alpha1"
    kind       = "Application"
    metadata = {
      name      = "infrastructure"
      namespace = "argocd"
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
