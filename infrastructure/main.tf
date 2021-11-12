module "fake_sierra" {
  source = "./stack"

  environment_name = "public"
  app_image        = "${aws_ecr_repository.fake_sierra.repository_url}:env.public"

  cluster_arn = aws_ecs_cluster.cluster.arn
  cert_arn    = aws_acm_certificate.cert.arn

  private_subnets = local.private_subnets
  public_subnets  = local.public_subnets
  vpc_id          = local.vpc_id
}
