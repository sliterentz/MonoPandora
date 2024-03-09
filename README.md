# Mono Pandora
Boiler mono repo template for backend (Fasitify, NestJs, NextJs) & Frontend (React) 

## Prerequisites
This configuration has been tested on Windows 11 & Almalinux 9 WSL with Docker included.

```bash
# Install docker in AlmaLinux 9 WSL:
sudo dnf remove -y podman buidah
sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker
sudo systemctl status docker
sudo usermod -aG docker $USER
newgrp docker
docker --version

# Install homebrew in WSL
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install gcc
echo 'eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)' >> ~/.bashrc
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

# Install openssl in WSL
brew install openssl
brew info openssl


# Generate Cert and Private Key for Gitlab & Gitlab Runner
cd .cert
mkdir gitlab gitlab_runner
domain='gitlab.example.com'
openssl genrsa -out ca.key 4096
openssl req -new -x509 -days 3650 -key ca.key -out ca.crt
openssl req -newkey rsa:4096 -nodes -keyout $domain.key -out $domain.csr
openssl x509 -req -extfile <(printf "subjectAltName=DNS:gitlab,DNS:$domain") -days 3650 -in $domain.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out $domain.crt
mv gitlab.example.com.crt gitlab.example.com.key gitlab
mv ca.crt gitlab_runner
```

## Setup
```bash
cd ..
docker-compose up -d
```