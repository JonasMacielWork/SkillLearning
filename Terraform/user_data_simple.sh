#!/bin/bash
set -e

# Simple user data script for Free Tier (minimal services)
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

# Install AWS X-Ray daemon (optional for Free Tier)
cd /tmp
curl -o xray-daemon-linux-3.x.zip https://s3.us-east-2.amazonaws.com/aws-xray-assets.us-east-2/xray-daemon/aws-xray-daemon-linux-3.x.zip
unzip xray-daemon-linux-3.x.zip
cp xray-daemon-linux-3.x/xray /usr/local/bin/xray
chmod +x /usr/local/bin/xray

# Create X-Ray daemon service (lightweight config)
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

# Create application directory
mkdir -p /opt/skilllearning
chown ubuntu:ubuntu /opt/skilllearning

# Create simple health check endpoint (for testing)
cat > /opt/skilllearning/health.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>SkillLearning Health Check</title>
</head>
<body>
    <h1>SkillLearning API is Running!</h1>
    <p>Instance ID: $(curl -s http://169.254.169.254/latest/meta-data/instance-id)</p>
    <p>Timestamp: $(date)</p>
</body>
</html>
EOF

# Start a simple HTTP server for health checks (port 8080)
cd /opt/skilllearning
nohup python3 -m http.server 8080 > /var/log/simple-server.log 2>&1 &

echo "Simple user data script completed successfully" >> /var/log/user-data.log

# Note: Your application should be deployed separately via Docker
# Example commands to run your application:
# docker pull your-app-image
# docker run -d -p 5000:5000 --name skilllearning-app your-app-image