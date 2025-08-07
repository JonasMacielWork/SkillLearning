# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = module.vpc.private_subnets
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = module.vpc.public_subnets
}

# Load Balancer Outputs (apenas se habilitado)
output "alb_dns_name" {
  description = "DNS name of the application load balancer"
  value       = var.enable_load_balancer ? aws_lb.app[0].dns_name : "Load Balancer desabilitado - use o IP da EC2 diretamente"
}

output "alb_zone_id" {
  description = "Zone ID of the application load balancer"
  value       = var.enable_load_balancer ? aws_lb.app[0].zone_id : "N/A"
}

output "application_url" {
  description = "URL to access the application"
  value       = var.enable_load_balancer ? "http://${aws_lb.app[0].dns_name}" : "Sem Load Balancer - Use o IP da EC2 na porta 5000"
}

# EC2 Instance IP (para acesso direto sem Load Balancer)
output "ec2_public_ips" {
  description = "IPs públicos das instâncias EC2"
  value       = "Verifique no AWS Console EC2 ou use: aws ec2 describe-instances"
}

# Database Outputs
output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.postgres.endpoint
  sensitive   = true
}

output "rds_port" {
  description = "RDS instance port"
  value       = aws_db_instance.postgres.port
}

# Security Group Outputs
output "app_security_group_id" {
  description = "ID of the application security group"
  value       = aws_security_group.app_sg.id
}

output "alb_security_group_id" {
  description = "ID of the ALB security group"
  value       = aws_security_group.alb_sg.id
}

output "db_security_group_id" {
  description = "ID of the database security group"
  value       = aws_security_group.db_sg.id
}

# Auto Scaling Outputs
output "autoscaling_group_arn" {
  description = "ARN of the Auto Scaling Group"
  value       = aws_autoscaling_group.app.arn
}

output "launch_template_id" {
  description = "ID of the launch template"
  value       = aws_launch_template.app.id
}