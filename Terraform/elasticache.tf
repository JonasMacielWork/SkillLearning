# ElastiCache Redis (Free Tier: cache.t2.micro - 750 horas/mês)

# Subnet Group para ElastiCache
resource "aws_elasticache_subnet_group" "redis" {
  name       = "${var.project_name}-${var.environment}-redis-subnet-group"
  subnet_ids = length(module.vpc.private_subnets) > 0 ? module.vpc.private_subnets : module.vpc.public_subnets
  
  description = "Subnet group para Redis ElastiCache"

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-redis-subnet-group"
  })
}

# Security Group para ElastiCache Redis  
resource "aws_security_group" "redis_sg" {
  name_prefix = "${var.project_name}-${var.environment}-redis-"
  vpc_id      = module.vpc.vpc_id
  description = "Security group para ElastiCache Redis"

  ingress {
    description     = "Redis port from application"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }

  # Redis não precisa de regras de saída
  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-redis-sg"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# ElastiCache Redis Cluster (Free Tier)
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "${var.project_name}-${var.environment}-redis"
  description                = "Redis cluster para SkillLearning"
  
  # Free Tier Configuration
  node_type            = "cache.t2.micro"  # Free Tier: 750 horas/mês
  port                 = 6379
  parameter_group_name = "default.redis7"
  
  # Configuração de cluster
  num_cache_clusters = 1  # Free Tier: apenas 1 nó
  
  # Network & Security
  subnet_group_name  = aws_elasticache_subnet_group.redis.name
  security_group_ids = [aws_security_group.redis_sg.id]
  
  # Free Tier optimizations
  at_rest_encryption_enabled = false  # Encryption pode ter custos extras
  transit_encryption_enabled = false  # Encryption pode ter custos extras
  
  # Backup settings (Free Tier)
  snapshot_retention_limit = 0  # Snapshots podem custar
  snapshot_window         = "03:00-05:00"
  
  # Maintenance
  maintenance_window       = "sun:05:00-sun:07:00"
  auto_minor_version_upgrade = true
  
  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-redis"
  })
}