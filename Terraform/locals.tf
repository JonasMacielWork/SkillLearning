locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    Owner       = var.owner
    ManagedBy   = "Terraform"
  }

  # Use provided AZs or get them from data source
  availability_zones = length(var.availability_zones) > 0 ? var.availability_zones : data.aws_availability_zones.available.names

  # Network configuration
  private_subnet_cidrs = [
    cidrsubnet(var.vpc_cidr_block, 8, 1),
    cidrsubnet(var.vpc_cidr_block, 8, 2)
  ]

  public_subnet_cidrs = [
    cidrsubnet(var.vpc_cidr_block, 8, 101),
    cidrsubnet(var.vpc_cidr_block, 8, 102)
  ]

  # Database configuration
  db_subnet_group_name = "${var.project_name}-${var.environment}-db-subnet-group"
  
  # Security group names
  alb_sg_name = "${var.project_name}-${var.environment}-alb-sg"
  app_sg_name = "${var.project_name}-${var.environment}-app-sg"
  db_sg_name  = "${var.project_name}-${var.environment}-db-sg"
}