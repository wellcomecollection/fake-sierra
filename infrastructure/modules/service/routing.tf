resource "aws_alb_target_group" "http" {
  # Must only contain alphanumerics and hyphens.
  name   = replace(var.service_name, "_", "-")
  port   = module.nginx_container.container_port
  vpc_id = var.vpc_id

  protocol    = "HTTP"
  target_type = "ip"

  // using the values below makes blue-green deployments acceptably quick

  deregistration_delay = 10

  health_check {
    interval            = 10
    path                = "/"
    port                = module.nginx_container.container_port
    protocol            = "HTTP"
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
    matcher             = 200
  }
}
