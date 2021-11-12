resource "aws_ecr_repository" "fake_sierra" {
  name = "uk.ac.wellcome/fake_sierra"

  lifecycle {
    prevent_destroy = true
  }
}
