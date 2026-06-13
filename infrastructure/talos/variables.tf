variable "cluster_name" {
    type = string
    default = "homelab"
}

variable "default_gateway" {
    type = string
    default = "192.168.1.1"
}

variable "talos_cp_ip_address" {
    type = string
    default = "192.168.1.222"
}

variable "talos_worker_ip_address" {
    type = string
    default = "192.168.1.223"
}

variable "talos_version" {
    type = string
    default = "v1.13.4"
}

variable "root_ca_crt" {
  type      = string
  sensitive = true
}

variable "root_ca_key" {
  type      = string
  sensitive = true
}

variable "democratic_ssh_key" {
  type      = string
  sensitive = true
}

variable "democratic_api_key" {
  type      = string
  sensitive = true
}