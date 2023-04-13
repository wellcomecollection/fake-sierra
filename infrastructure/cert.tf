module "cert" {
  source = "github.com/wellcomecollection/terraform-aws-acm-certificate?ref=v1.0.0"

  domain_name = local.fake_sierra_origin

  zone_id = data.aws_route53_zone.zone.zone_id

  providers = {
    aws.dns = aws.dns
  }
}
