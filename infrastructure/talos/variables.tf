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

variable "vpn_gateway_ip_address" {
    type = string
    default = "192.168.1.225"
}

variable "enable_vpn_gateway" {
    type    = bool
    default = false
}

variable "route_talos_through_vpn" {
    type    = bool
    default = false
}

variable "talos_version" {
    type = string
    default = "v1.13.4"
}

variable "expressvpn_openvpn_profile" {
  type        = string
  sensitive   = true
  default     = null
  description = "Complete ExpressVPN OpenVPN (.ovpn) profile content."
}

variable "expressvpn_username" {
  type      = string
  sensitive = true
  default   = null
}

variable "expressvpn_password" {
  type      = string
  sensitive = true
  default   = null
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