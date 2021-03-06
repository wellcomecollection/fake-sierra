variable "subnets" {
  type = list(string)
}

variable "cluster_arn" {}

variable "service_name" {}

variable "vpc_id" {}

variable "container_image" {}
variable "container_port" {
  type = number
}

variable "security_group_ids" {
  type = list(string)
}

variable "env_vars" {
  type    = map(string)
  default = {}
}

variable "secret_env_vars" {
  type    = map(string)
  default = {}
}

variable "nginx_cpu" {
  default = 512
  type    = number
}

variable "nginx_memory" {
  default = 1024
  type    = number
}

variable "app_cpu" {
  default = 512
  type    = number
}

variable "app_memory" {
  default = 1024
  type    = number
}

variable "desired_task_count" {
  default = 3
}

variable "deployment_service_name" {
  type        = string
  description = "Used by weco-deploy to determine which services to deploy, if unset the value used will be var.name"
  default     = ""
}

variable "deployment_service_env" {
  type        = string
  description = "Used by weco-deploy to determine which services to deploy in conjunction with deployment_service_name"
  default     = "prod"
}
