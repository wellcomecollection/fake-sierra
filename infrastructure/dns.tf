resource "aws_route53_record" "fake_sierra" {
  provider = aws.dns

  name    = local.fake_sierra_origin
  zone_id = data.aws_route53_zone.zone.id
  type    = "A"

  alias {
    name                   = module.fake_sierra.alb_dns_name
    zone_id                = module.fake_sierra.alb_zone_id
    evaluate_target_health = false
  }
}

data "aws_route53_zone" "zone" {
  provider = aws.dns

  name = "wellcomecollection.org."
}
