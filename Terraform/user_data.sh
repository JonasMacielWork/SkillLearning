#!/bin/bash
set -e

# Update system
apt-get update
apt-get upgrade -y

# Install required packages
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    awscli \
    jq

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# Install AWS X-Ray daemon
cd /tmp
curl -o xray-daemon-linux-3.x.zip https://s3.us-east-2.amazonaws.com/aws-xray-assets.us-east-2/xray-daemon/aws-xray-daemon-linux-3.x.zip
unzip xray-daemon-linux-3.x.zip
cp xray-daemon-linux-3.x/xray /usr/local/bin/xray
chmod +x /usr/local/bin/xray

# Create X-Ray daemon service
cat > /etc/systemd/system/xray-daemon.service << EOF
[Unit]
Description=AWS X-Ray Daemon
After=network.target

[Service]
Type=simple
User=xray
ExecStart=/usr/local/bin/xray -t 0.0.0.0:2000 -b 0.0.0.0:2000 -o -n ${region}
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Create xray user
useradd --system --no-create-home --shell /bin/false xray

# Start X-Ray daemon
systemctl daemon-reload
systemctl enable xray-daemon
systemctl start xray-daemon

# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
dpkg -i amazon-cloudwatch-agent.deb

# Configure CloudWatch agent
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << EOF
{
    "agent": {
        "metrics_collection_interval": 60,
        "run_as_user": "cwagent"
    },
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                    {
                        "file_path": "/var/log/syslog",
                        "log_group_name": "/aws/ec2/skilllearning/syslog",
                        "log_stream_name": "{instance_id}"
                    },
                    {
                        "file_path": "/var/log/docker.log",
                        "log_group_name": "/aws/ec2/skilllearning/docker",
                        "log_stream_name": "{instance_id}"
                    }
                ]
            }
        }
    },
    "metrics": {
        "namespace": "AWS/EC2/SkillLearning",
        "metrics_collected": {
            "cpu": {
                "measurement": [
                    "cpu_usage_idle",
                    "cpu_usage_iowait",
                    "cpu_usage_user",
                    "cpu_usage_system"
                ],
                "metrics_collection_interval": 60
            },
            "disk": {
                "measurement": [
                    "used_percent"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "diskio": {
                "measurement": [
                    "io_time"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "mem": {
                "measurement": [
                    "mem_used_percent"
                ],
                "metrics_collection_interval": 60
            },
            "netstat": {
                "measurement": [
                    "tcp_established",
                    "tcp_time_wait"
                ],
                "metrics_collection_interval": 60
            },
            "swap": {
                "measurement": [
                    "swap_used_percent"
                ],
                "metrics_collection_interval": 60
            }
        }
    }
}
EOF

# Start CloudWatch agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s

# === DEPLOYMENT DA APLICAÇÃO ===

# Criar diretório da aplicação
mkdir -p /opt/skilllearning
chown ubuntu:ubuntu /opt/skilllearning
cd /opt/skilllearning

# Clonar o repositório (substitua pela URL do seu repo)
# git clone https://github.com/seu-usuario/SkillLearning.git .

# Por enquanto, criar estrutura básica para deployment manual
mkdir -p {Backend,Build}

# Criar arquivo de environment variables para Docker Compose
cat > .env << 'EOL'
# Variáveis para Docker Compose Híbrido
# Estas serão substituídas pelos valores reais do Terraform

# RDS Connection (será injetada pelo Terraform)
RDS_CONNECTION_STRING="Host=TERRAFORM_WILL_REPLACE;Port=5432;Database=skilllearningdb;Username=postgres;Password=TERRAFORM_WILL_REPLACE"

# ElastiCache Endpoint (será injetada pelo Terraform)
ELASTICACHE_ENDPOINT="TERRAFORM_WILL_REPLACE"

# JWT Secret
JWT_SECRET_KEY="TERRAFORM_WILL_REPLACE"

# Email Configuration
EMAIL_SENDER_USER="TERRAFORM_WILL_REPLACE"
EMAIL_SENDER_PASSWORD="TERRAFORM_WILL_REPLACE"

# AWS Credentials
AWS_REGION="${region}"
AWS_ACCESS_KEY_ID="TERRAFORM_WILL_REPLACE"
AWS_SECRET_ACCESS_KEY="TERRAFORM_WILL_REPLACE"
EOL

# Criar script de deploy
cat > deploy.sh << 'EOL'
#!/bin/bash
# Script para fazer deploy da aplicação

echo "Fazendo deploy da aplicação SkillLearning..."

# Parar containers existentes
docker-compose -f Build/docker-compose.hybrid.yml down

# Fazer build das novas imagens
docker-compose -f Build/docker-compose.hybrid.yml build --no-cache

# Subir os containers
docker-compose -f Build/docker-compose.hybrid.yml up -d

# Mostrar status
docker-compose -f Build/docker-compose.hybrid.yml ps

echo "Deploy concluído! API disponível na porta 5000"
EOL

chmod +x deploy.sh

# Criar arquivo de status para monitoramento
cat > /var/log/skilllearning-status.log << EOL
$(date): Instância inicializada
$(date): Docker instalado
$(date): X-Ray daemon iniciado
$(date): CloudWatch agent configurado
$(date): Pronto para deploy da aplicação
EOL

echo "User data script completed successfully" >> /var/log/user-data.log
echo "SkillLearning environment ready for deployment" >> /var/log/user-data.log