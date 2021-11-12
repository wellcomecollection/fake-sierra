locals {
  fake_sierra_origin = "fake-sierra.wellcomecollection.org"

  catalogue_vpcs = data.terraform_remote_state.accounts_catalogue.outputs

  vpc_id          = local.catalogue_vpcs["catalogue_vpc_id"]
  private_subnets = local.catalogue_vpcs["catalogue_vpc_private_subnets"]
  public_subnets  = local.catalogue_vpcs["catalogue_vpc_public_subnets"]
}
