# 🚀 Guia de Deploy - SkillLearning AWS

## Pré-requisitos

1. **AWS CLI configurado:**
```bash
aws configure
# Inserir: Access Key, Secret Key, Region (us-east-1), Output (json)
```

2. **Terraform instalado** (já temos em tools/terraform.exe)

3. **SSH Key gerada:**
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/skilllearning_key
```

## 🏗️ PASSO 1: Deploy da Infraestrutura

### Configurar variáveis:
```bash
cd Terraform
cp terraform.tfvars.example terraform.tfvars
```

### Editar terraform.tfvars:
```hcl
# Suas configurações reais
aws_region = "us-east-1"
project_name = "skilllearning"
environment = "dev"

# Sua chave SSH
key_pair_name = "skilllearning-keypair"
public_key_path = "C:/Users/SeuUser/.ssh/skilllearning_key.pub"

# Seu IP (descubra em: https://whatismyipaddress.com/)
allowed_ssh_cidrs = ["SEU.IP.AQUI.AQUI/32"]

# Credenciais do banco
db_username = "postgres"
db_password = "MinhaSenh@Segur@2024"

# Opções Free Tier
enable_load_balancer = false
enable_elasticache = true
enable_nat_gateway = false
```

### Executar Terraform:
```bash
# Inicializar
..\tools\terraform.exe init

# Ver o que será criado
..\tools\terraform.exe plan

# Criar tudo (confirmar com 'yes')
..\tools\terraform.exe apply
```

## 🎯 PASSO 2: Verificar Recursos Criados

### No AWS Console:
1. **EC2 Dashboard:** Ver instância rodando
2. **RDS Dashboard:** Ver banco PostgreSQL
3. **ElastiCache Dashboard:** Ver cluster Redis
4. **VPC Dashboard:** Ver rede criada

### Via CLI:
```bash
# Ver instâncias EC2
aws ec2 describe-instances --filters "Name=tag:Project,Values=skilllearning"

# Ver RDS
aws rds describe-db-instances

# Ver ElastiCache
aws elasticache describe-replication-groups
```

## 📦 PASSO 3: Deploy da Aplicação

### Conectar na EC2:
```bash
# IP público estará no output do Terraform
ssh -i ~/.ssh/skilllearning_key ubuntu@SEU_EC2_IP
```

### Na EC2, verificar status:
```bash
# Ver logs de inicialização
sudo tail -f /var/log/user-data.log

# Ver status dos serviços
sudo systemctl status docker
sudo systemctl status xray-daemon

# Ver se Docker está funcionando
docker --version
docker-compose --version
```

### Fazer deploy da aplicação:
```bash
cd /opt/skilllearning

# Primeiro, precisamos configurar as variáveis de ambiente
# O user-data já criou um template .env, vamos atualizá-lo

# Obter endpoint do RDS
RDS_ENDPOINT=$(aws rds describe-db-instances --query 'DBInstances[0].Endpoint.Address' --output text)

# Obter endpoint do ElastiCache
REDIS_ENDPOINT=$(aws elasticache describe-replication-groups --query 'ReplicationGroups[0].NodeGroups[0].PrimaryEndpoint.Address' --output text)

# Atualizar .env com valores reais
cat > .env << EOL
RDS_CONNECTION_STRING="Host=${RDS_ENDPOINT};Port=5432;Database=skilllearningdb;Username=postgres;Password=MinhaSenh@Segur@2024"
ELASTICACHE_ENDPOINT="${REDIS_ENDPOINT}"
JWT_SECRET_KEY="minha-chave-jwt-super-secreta-com-32-caracteres-ou-mais"
EMAIL_SENDER_USER="seu-email@gmail.com"
EMAIL_SENDER_PASSWORD="sua-senha-de-app"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="sua-access-key"
AWS_SECRET_ACCESS_KEY="sua-secret-key"
EOL

# Para este exemplo, vamos usar uma versão simplificada
# Clone o repositório (substitua pela URL real)
git clone https://github.com/seu-usuario/SkillLearning.git .

# Fazer deploy
./deploy.sh
```

## 🧪 PASSO 4: Testar a Aplicação

### Verificar se containers estão rodando:
```bash
docker-compose -f Build/docker-compose.hybrid.yml ps
```

### Testar API:
```bash
# Health check
curl http://localhost:5000/health

# Se tiver IP público na EC2 (sem Load Balancer)
curl http://SEU_EC2_IP:5000/health
```

### Ver logs:
```bash
# Logs da API
docker-compose -f Build/docker-compose.hybrid.yml logs skilllearning-api

# Logs do Worker
docker-compose -f Build/docker-compose.hybrid.yml logs skilllearning-workers
```

### Testar endpoints básicos:
```bash
# Registrar usuário
curl -X POST http://SEU_EC2_IP:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","email":"teste@test.com","password":"Test123!"}'

# Login
curl -X POST http://SEU_EC2_IP:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","password":"Test123!"}'
```

## 📊 PASSO 5: Monitoramento

### CloudWatch Logs:
- Acesse AWS Console → CloudWatch → Log Groups
- Procure por `/aws/ec2/skilllearning/*`

### X-Ray Traces:
- Acesse AWS Console → X-Ray → Traces
- Veja as requisições sendo rastreadas

### Métricas EC2:
- Acesse AWS Console → EC2 → Monitoring
- Veja CPU, Memória, Rede

## 🧹 PASSO 6: Limpeza Total (IMPORTANTE!)

### Parar aplicação:
```bash
# Na EC2
docker-compose -f Build/docker-compose.hybrid.yml down
docker system prune -af
```

### Destruir infraestrutura:
```bash
# No seu computador local, na pasta Terraform
..\tools\terraform.exe destroy

# Confirmar com 'yes' - VAI DELETAR TUDO!
```

### Verificar limpeza no AWS Console:
1. **EC2:** Nenhuma instância rodando
2. **RDS:** Nenhum banco ativo
3. **ElastiCache:** Nenhum cluster
4. **VPC:** Apenas a default

### Verificação extra via CLI:
```bash
# Conferir se não sobrou nada
aws ec2 describe-instances --query 'Reservations[].Instances[?State.Name==`running`]'
aws rds describe-db-instances --query 'DBInstances[?DBInstanceStatus==`available`]'
aws elasticache describe-replication-groups --query 'ReplicationGroups[?Status==`available`]'
```

### ⚠️ ATENÇÃO: Custos Ocultos

Mesmo no Free Tier, monitore:
- **Data Transfer:** > 1GB/mês pode gerar cobrança
- **EBS Snapshots:** Se criados automaticamente
- **CloudWatch Logs:** > 5GB pode gerar cobrança
- **X-Ray Traces:** > 1M traces/mês pode gerar cobrança

### 💡 Dica Final:
Sempre execute `terraform destroy` ao final dos testes para garantir que nada ficará rodando e gerando custos inesperados!