resource "aws_alb" "fake_sierra" {
  name            = "${var.environment_name}-fake-sierra"
  subnets         = var.public_subnets
  security_groups = [aws_security_group.lb.id]

  load_balancer_type = "application"
  internal           = false
}

resource "aws_alb_listener" "https" {
  load_balancer_arn = aws_alb.fake_sierra.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.cert_arn

  default_action {
    type             = "forward"
    target_group_arn = module.service.target_group_arn
  }
}

resource "aws_alb_listener" "http" {
  load_balancer_arn = aws_alb.fake_sierra.id
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}
