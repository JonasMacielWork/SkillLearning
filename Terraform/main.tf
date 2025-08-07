# VPC Configuration
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.15"

  name = "${var.project_name}-${var.environment}-vpc"
  cidr = var.vpc_cidr_block

  azs             = local.availability_zones
  private_subnets = local.private_subnet_cidrs
  public_subnets  = local.public_subnet_cidrs

  # NAT Gateway configuration
  enable_nat_gateway   = var.enable_nat_gateway
  single_nat_gateway   = var.environment != "prod"
  one_nat_gateway_per_az = var.environment == "prod"

  # DNS configuration
  enable_dns_hostnames = true
  enable_dns_support   = true

  # VPC Flow Logs
  enable_flow_log                      = true
  create_flow_log_cloudwatch_iam_role  = true
  create_flow_log_cloudwatch_log_group = true

  # VPN Gateway
  enable_vpn_gateway = var.enable_vpn_gateway

  tags = local.common_tags
}

# Application Load Balancer Security Group
resource "aws_security_group" "alb_sg" {
  name_prefix = local.alb_sg_name
  vpc_id      = module.vpc.vpc_id
  description = "Security group for Application Load Balancer"

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = local.alb_sg_name
  })

  lifecycle {
    create_before_destroy = true
  }
}

# Application Security Group
resource "aws_security_group" "app_sg" {
  name_prefix = local.app_sg_name
  vpc_id      = module.vpc.vpc_id
  description = "Security group for application instances"

  # SSH access from bastion or specific IPs only
  dynamic "ingress" {
    for_each = length(var.allowed_ssh_cidrs) > 0 ? var.allowed_ssh_cidrs : []
    content {
      description = "SSH from allowed CIDRs"
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = [ingress.value]
    }
  }

  # Application port from ALB only
  ingress {
    description     = "App port from ALB"
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = local.app_sg_name
  })

  lifecycle {
    create_before_destroy = true
  }
}

# Database Security Group
resource "aws_security_group" "db_sg" {
  name_prefix = local.db_sg_name
  vpc_id      = module.vpc.vpc_id
  description = "Security group for RDS database"

  ingress {
    description     = "PostgreSQL from application"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }

  # No outbound rules needed for RDS
  tags = merge(local.common_tags, {
    Name = local.db_sg_name
  })

  lifecycle {
    create_before_destroy = true
  }
}

# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = local.db_subnet_group_name
  subnet_ids = module.vpc.private_subnets
  description = "Database subnet group for ${var.project_name}"

  tags = merge(local.common_tags, {
    Name = local.db_subnet_group_name
  })
}

# RDS Parameter Group
resource "aws_db_parameter_group" "postgres" {
  family = "postgres16"
  name   = "${var.project_name}-${var.environment}-postgres16"
  description = "Custom parameter group for PostgreSQL 16"

  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }

  tags = local.common_tags
}

# RDS Instance
resource "aws_db_instance" "postgres" {
  identifier = "${var.project_name}-${var.environment}-postgres"
  
  # Engine Configuration
  engine                 = "postgres"
  engine_version         = "16.6"
  instance_class         = var.db_instance_class
  parameter_group_name   = aws_db_parameter_group.postgres.name
  
  # Storage Configuration (Free Tier: 20GB max)
  allocated_storage     = 20
  max_allocated_storage = 20  # Stay within Free Tier limit
  storage_type         = "gp2"  # gp2 is Free Tier, gp3 may have costs
  storage_encrypted    = false  # Encryption may incur costs
  
  # Database Configuration
  db_name  = "skilllearningdb"
  username = var.db_username
  password = var.db_password
  port     = 5432
  
  # Network Configuration
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  publicly_accessible    = false
  
  # Availability Configuration (Free Tier: Single AZ only)
  multi_az               = false  # Multi-AZ costs money
  availability_zone      = data.aws_availability_zones.available.names[0]
  
  # Backup Configuration
  backup_retention_period = var.backup_retention_days
  backup_window          = "03:00-04:00"
  maintenance_window     = "Sun:04:00-Sun:05:00"
  
  # Deletion Protection (Free Tier optimized)
  skip_final_snapshot       = true  # Snapshots may cost money to store
  final_snapshot_identifier = null
  deletion_protection       = false
  
  # Monitoring (Free Tier: Basic only)
  monitoring_interval = 0  # Enhanced monitoring costs money
  # monitoring_role_arn = aws_iam_role.rds_enhanced_monitoring.arn  # Commented out
  
  # Performance Insights (may incur costs)
  performance_insights_enabled = false
  
  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-postgres"
  })
}

# Key Pair (only create if name is provided and file exists)
resource "aws_key_pair" "deployer" {
  count = var.key_pair_name != "" && fileexists(var.public_key_path) ? 1 : 0
  
  key_name   = var.key_pair_name
  public_key = file(var.public_key_path)

  tags = merge(local.common_tags, {
    Name = var.key_pair_name
  })
}

# IAM Role for EC2 instances
resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-${var.environment}-ec2-role"
  description = "IAM role for EC2 instances"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

# IAM Role for RDS Enhanced Monitoring (DISABLED - costs money)
# resource "aws_iam_role" "rds_enhanced_monitoring" {
#   name = "${var.project_name}-${var.environment}-rds-monitoring-role"
#   description = "IAM role for RDS enhanced monitoring"
# 
#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = "sts:AssumeRole"
#         Effect = "Allow"
#         Principal = {
#           Service = "monitoring.rds.amazonaws.com"
#         }
#       }
#     ]
#   })
# 
#   tags = local.common_tags
# }

# Policy attachments
resource "aws_iam_role_policy_attachment" "xray_policy" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
}

resource "aws_iam_role_policy_attachment" "ssm_policy" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "cloudwatch_agent_policy" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

# resource "aws_iam_role_policy_attachment" "rds_monitoring_policy" {
#   role       = aws_iam_role.rds_enhanced_monitoring.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
# }

# Instance Profile
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-${var.environment}-ec2-profile"
  role = aws_iam_role.ec2_role.name

  tags = local.common_tags
}

# Launch Template for Auto Scaling
resource "aws_launch_template" "app" {
  name_prefix   = "${var.project_name}-${var.environment}-"
  description   = "Launch template for SkillLearning application"
  image_id      = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = length(aws_key_pair.deployer) > 0 ? aws_key_pair.deployer[0].key_name : null

  vpc_security_group_ids = [aws_security_group.app_sg.id]
  
  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_profile.name
  }

  block_device_mappings {
    device_name = "/dev/sda1"
    ebs {
      volume_size = 30  # Free Tier: 30GB EBS for 12 months
      volume_type = "gp2"  # gp2 is Free Tier eligible
      encrypted   = false  # Encryption may incur additional costs
      delete_on_termination = true
    }
  }

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
    http_put_response_hop_limit = 1
  }

  monitoring {
    enabled = true
  }

  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    region = var.aws_region
  }))

  tag_specifications {
    resource_type = "instance"
    tags = merge(local.common_tags, {
      Name = "${var.project_name}-${var.environment}-app"
    })
  }

  tags = local.common_tags

  lifecycle {
    create_before_destroy = true
  }
}

# Application Load Balancer (OPCIONAL - custa ~$20/mês)
# Para Free Tier total, comente este bloco e use acesso direto na porta 5000
resource "aws_lb" "app" {
  count = var.enable_load_balancer ? 1 : 0
  
  name               = "${var.project_name}-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = module.vpc.public_subnets

  enable_deletion_protection = false  # Free Tier: sempre false
  enable_http2              = true
  drop_invalid_header_fields = true

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-alb"
  })
}

# Target Group (apenas se ALB estiver habilitado)
resource "aws_lb_target_group" "app" {
  count = var.enable_load_balancer ? 1 : 0
  
  name     = "${var.project_name}-${var.environment}-tg"
  port     = 5000
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id
  target_type = "instance"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/health"
    matcher             = "200"
    port                = "traffic-port"
    protocol            = "HTTP"
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-tg"
  })
}

# ALB Listener (apenas se ALB estiver habilitado)
resource "aws_lb_listener" "app" {
  count = var.enable_load_balancer ? 1 : 0
  
  load_balancer_arn = aws_lb.app[0].arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app[0].arn
  }

  tags = local.common_tags
}

# Auto Scaling Group
# Auto Scaling Group (Free Tier: single instance)
resource "aws_autoscaling_group" "app" {
  name                = "${var.project_name}-${var.environment}-asg"
  vpc_zone_identifier = var.enable_nat_gateway && length(module.vpc.private_subnets) > 0 ? module.vpc.private_subnets : module.vpc.public_subnets
  target_group_arns   = var.enable_load_balancer ? [aws_lb_target_group.app[0].arn] : []
  health_check_type   = var.enable_load_balancer ? "ELB" : "EC2"
  health_check_grace_period = 300

  # Free Tier: Only 1 instance to stay within limits
  min_size         = 1
  max_size         = 1
  desired_capacity = 1

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.project_name}-${var.environment}-asg-instance"
    propagate_at_launch = true
  }

  dynamic "tag" {
    for_each = local.common_tags
    content {
      key                 = tag.key
      value               = tag.value
      propagate_at_launch = true
    }
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 50
    }
  }
}