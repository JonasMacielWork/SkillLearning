# SkillLearning Infrastructure

This directory contains the Terraform configuration for provisioning the AWS infrastructure for the SkillLearning application.

## Architecture

The infrastructure includes:

- **VPC** with public and private subnets across multiple AZs
- **Application Load Balancer** for traffic distribution
- **Auto Scaling Group** with Launch Template for high availability
- **RDS PostgreSQL** with enhanced monitoring and encryption
- **Security Groups** with least privilege access
- **IAM roles** for EC2 instances with necessary permissions
- **CloudWatch** and **X-Ray** integration for monitoring

## Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **Terraform** >= 1.5 installed
3. **SSH key pair** generated (if using EC2 access)

## Quick Start

### 1. Configure Variables

Copy the example configuration:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your values:

```hcl
# Basic Configuration
environment = "dev"  # or "staging", "prod"
project_name = "skilllearning"

# AWS Configuration  
aws_region = "us-east-1"

# Security Configuration
allowed_ssh_cidrs = ["YOUR.IP.ADDRESS.HERE/32"]

# Database Configuration
db_username = "postgres"
db_password = "your-secure-password"
```

### 2. Initialize and Plan

```bash
# Initialize Terraform
terraform init

# Review the execution plan
terraform plan
```

### 3. Deploy Infrastructure

```bash
# Apply the configuration
terraform apply
```

### 4. Access Your Application

After deployment, the application will be available at:

```bash
# Get the Load Balancer URL
terraform output application_url
```

## Configuration Options

### Environment-Specific Settings

The configuration automatically adjusts based on the `environment` variable:

| Setting | dev | staging | prod |
|---------|-----|---------|------|
| Auto Scaling Min/Max | 1/2 | 1/3 | 2/4 |
| RDS Multi-AZ | false | false | true |
| Deletion Protection | false | false | true |
| Final Snapshot | skip | skip | create |

### Security Features

- **Encryption at rest** for EBS volumes and RDS
- **VPC Flow Logs** enabled
- **Security Groups** with minimal required access
- **IMDSv2** enforced on EC2 instances
- **Enhanced monitoring** for RDS

### Monitoring and Observability

- **CloudWatch Agent** for system metrics and logs
- **AWS X-Ray** daemon for distributed tracing
- **RDS Performance Insights** enabled
- **VPC Flow Logs** for network monitoring

## Remote State (Recommended)

For production use, configure remote state backend:

1. Create S3 bucket and DynamoDB table:

```bash
# Create S3 bucket for state
aws s3 mb s3://your-terraform-state-bucket

# Create DynamoDB table for locks
aws dynamodb create-table \
    --table-name terraform-locks \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST
```

2. Uncomment and configure the backend block in `providers.tf`:

```hcl
backend "s3" {
  bucket = "your-terraform-state-bucket"
  key    = "skilllearning/terraform.tfstate"
  region = "us-east-1"
  dynamodb_table = "terraform-locks"
  encrypt = true
}
```

3. Initialize with remote backend:

```bash
terraform init -migrate-state
```

## Outputs

Key outputs after deployment:

- `application_url` - URL to access the application
- `alb_dns_name` - Load balancer DNS name
- `rds_endpoint` - Database endpoint (sensitive)
- `vpc_id` - VPC ID for reference

## Cleanup

To destroy all resources:

```bash
terraform destroy
```

**Warning**: This will delete all infrastructure and data. Use with caution, especially in production.

## Security Best Practices

1. **Never commit** `terraform.tfvars` to version control
2. **Use remote state** with encryption enabled
3. **Enable MFA** for AWS accounts
4. **Rotate credentials** regularly
5. **Use AWS Secrets Manager** for sensitive data in production
6. **Review security groups** regularly
7. **Enable CloudTrail** for audit logging

## Troubleshooting

### Common Issues

1. **Key pair not found**: Ensure you've set `key_pair_name` and the SSH key exists
2. **Insufficient permissions**: Check IAM permissions for your AWS credentials
3. **Resource limits**: Verify AWS service quotas in your region
4. **VPC IP exhaustion**: Adjust CIDR blocks if needed

### Useful Commands

```bash
# Check current infrastructure
terraform show

# Import existing resources
terraform import aws_instance.example i-1234567890abcdef0

# Format configuration files
terraform fmt

# Validate configuration
terraform validate

# See detailed plan
terraform plan -detailed-exitcode
```

## Contributing

When making changes to the infrastructure:

1. **Test in dev environment** first
2. **Run `terraform plan`** before applying
3. **Update documentation** as needed
4. **Follow naming conventions** established in locals.tf

## Support

For issues or questions about this infrastructure:

1. Check the troubleshooting section above
2. Review AWS documentation for specific services
3. Open an issue in the repository