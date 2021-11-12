resource "aws_acm_certificate" "cert" {
  domain_name       = local.fake_sierra_origin
  validation_method = "DNS"
}

resource "aws_route53_record" "cert_validation" {
  provider = aws.dns

  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = data.aws_route53_zone.zone.zone_id
  name    = each.value.name
  records = [each.value.record]
  type    = each.value.type

  allow_overwrite = true
  ttl             = 60
}
