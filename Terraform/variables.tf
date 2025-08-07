variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
  
  validation {
    condition = contains(["us-east-1", "us-west-2", "eu-west-1", "eu-central-1"], var.aws_region)
    error_message = "AWS region must be a supported region."
  }
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
  
  validation {
    condition = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "skilllearning"
  
  validation {
    condition = can(regex("^[a-z0-9-]+$", var.project_name))
    error_message = "Project name must contain only lowercase letters, numbers, and hyphens."
  }
}

variable "owner" {
  description = "Owner of the resources"
  type        = string
  default     = "DevTeam"
}

variable "vpc_cidr_block" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
  
  validation {
    condition = can(cidrhost(var.vpc_cidr_block, 0))
    error_message = "VPC CIDR block must be a valid IPv4 CIDR."
  }
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = []
}

variable "instance_type" {
  description = "EC2 instance type (Free Tier eligible)"
  type        = string
  default     = "t2.micro"
  
  validation {
    condition = contains(["t2.micro", "t2.nano"], var.instance_type)
    error_message = "Instance type must be Free Tier eligible (t2.micro or t2.nano)."
  }
}

variable "key_pair_name" {
  description = "Name of AWS key pair for EC2 instances"
  type        = string
  default     = ""
}

variable "public_key_path" {
  description = "Path to public key file"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}

variable "db_instance_class" {
  description = "RDS instance class (Free Tier eligible)"
  type        = string
  default     = "db.t3.micro"
  
  validation {
    condition = contains(["db.t3.micro", "db.t2.micro"], var.db_instance_class)
    error_message = "RDS instance class must be Free Tier eligible."
  }
}

variable "db_username" {
  description = "Database master username"
  type        = string
  sensitive   = true
  default     = "postgres"
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
  
  validation {
    condition = length(var.db_password) >= 8
    error_message = "Database password must be at least 8 characters long."
  }
}

variable "allowed_ssh_cidrs" {
  description = "List of CIDR blocks allowed to SSH"
  type        = list(string)
  default     = []
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway (NOT FREE - costs ~$45/month)"
  type        = bool
  default     = false
}

variable "enable_vpn_gateway" {
  description = "Enable VPN Gateway"
  type        = bool
  default     = false
}

variable "enable_multi_az" {
  description = "Enable Multi-AZ deployment for RDS"
  type        = bool
  default     = false
}

variable "backup_retention_days" {
  description = "Number of days to retain backups (Free Tier: 0 days)"
  type        = number
  default     = 0
  
  validation {
    condition = var.backup_retention_days >= 0 && var.backup_retention_days <= 7
    error_message = "For Free Tier, backup retention should be 0-7 days maximum."
  }
}

variable "enable_load_balancer" {
  description = "Enable Application Load Balancer (CUSTA ~$20/mês - não é Free Tier)"
  type        = bool
  default     = false
}

variable "enable_elasticache" {
  description = "Enable ElastiCache Redis (Free Tier: cache.t2.micro)"
  type        = bool
  default     = true
}