# Alternative Free Tier Architecture (Single EC2 + RDS only)
# This is the most cost-effective option - comment out ALB resources in main.tf and use this instead

# Simple EC2 instance in public subnet (no Load Balancer)
resource "aws_instance" "simple_app" {
  count = 0  # Set to 1 to enable this simpler architecture
  
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = module.vpc.public_subnets[0]
  vpc_security_group_ids = [aws_security_group.simple_app_sg[0].id]
  key_name               = length(aws_key_pair.deployer) > 0 ? aws_key_pair.deployer[0].key_name : null
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  associate_public_ip_address = true

  root_block_device {
    volume_size = 30
    volume_type = "gp2"
    encrypted   = false
    delete_on_termination = true
  }

  user_data = base64encode(templatefile("${path.module}/user_data_simple.sh", {
    region = var.aws_region
  }))

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-simple-app"
  })
}

# Security Group for simple EC2 (no ALB)
resource "aws_security_group" "simple_app_sg" {
  count = 0  # Set to 1 to enable this simpler architecture
  
  name_prefix = "${var.project_name}-${var.environment}-simple-app-"
  vpc_id      = module.vpc.vpc_id
  description = "Security group for simple app instance"

  # SSH access
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

  # HTTP access directly to application
  ingress {
    description = "HTTP to application"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS access (if you add SSL later)
  ingress {
    description = "HTTPS to application"
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
    Name = "${var.project_name}-${var.environment}-simple-app-sg"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# Elastic IP for simple instance
resource "aws_eip" "simple_app" {
  count = 0  # Set to 1 to enable this simpler architecture
  
  instance = aws_instance.simple_app[0].id
  domain   = "vpc"

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-eip"
  })

  depends_on = [aws_instance.simple_app]
}