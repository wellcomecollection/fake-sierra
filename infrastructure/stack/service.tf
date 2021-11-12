module "service" {
  source                  = "../modules/service"
  service_name            = "fake-sierra-${var.environment_name}"
  deployment_service_name = "fake-sierra"
  deployment_service_env  = var.environment_name

  container_image = var.app_image
  container_port  = local.app_port

  app_cpu      = 384
  app_memory   = 768
  nginx_cpu    = 128
  nginx_memory = 256

  desired_task_count = 1

  env_vars = {
    PORT = local.app_port
  }

  security_group_ids = [aws_security_group.lb_ingress.id, aws_security_group.egress.id]
  subnets            = var.private_subnets

  cluster_arn = var.cluster_arn
  vpc_id      = var.vpc_id
}
