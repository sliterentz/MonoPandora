# Mono Pandora
Boiler template for multi-container docker services (Monorepo Design) for self manage CI/CD (Gitlab, Gitlab Runner, Jenkins, SonarQube) Environment include with Monitoring Features

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

### Setup All Services
```bash
cd ..
docker-compose up -d
```

### Inital Setup Config
#### All Service URL
Gitlab
https://gitlab.example.com:10443/
Jenkins
http://jenkins.example.com:8080/jenkins
SonarQube
http://sonarqube.example.com:9000/
Grafana Dashboard
http://localhost:3000/

### Jenkins initial Setup
1. Access Jenkins via browser
2. Get initial admin password in local_gitlab
```bash
docker exec -it local_jenkins sh
sudo cat /var/jenkins_home/secrets/initialAdminPassword
```
3. Copy the output and paste it into administrator password text field and click on Continue
4. Click on the Install suggested plugins
5. Click on the Skip and continue as admin, or set new user for jenkins access and Save and continue 
6. Set value into http://jenkins.example.com:8080/jenkins in input text, and Click on Save and Finish

### Install required jenkins plugins
1. Access jenkin plugin menu via Manage Jenkins > Click Plugins > Click Available plugins 
2. Search list of plugin by this keyword:
    GitLab API Plugin
    Gitlab Authentication plugin
    Gitlab Plugin
    Docker
    Docker Commons
    Docker Pipeline
    Docker API
    docker-build-step
    Eclipse Temurin installer
    NodeJS
    OWASP Dependency-Check
    SonarQube Scanner
    Email Extension Plugin
3. Check all list of plugin > Click Install

### Gitlab initial Setup
1. Access Gitlab via browser
2. Set Access Key / Auth via Click Project > Settings > Access Tokens > Click New Add new token
3. Fill Token Name as you want
4. Select Expiration Date > Select a role as Reporter
5. Check read_api and read_repository for scopes
6. Click Create project access token
7. Click Copy

### Sonar jenkin webhook and create 
1. Access sonar via browser
2. Login with admin / admin
3. Create via Administration > Security > Users > Click on Tokens and Update Token > Fill with jenkins-auth > and click on Generate Token > Click Copy 
4. Create webhook Access via Dashboard > Administration > Configuration > Webhooks > Click Create
5. Fill with this data 
   Name : jenkins-server
   URL : http://jenkins.example.com:8080/jenkins/sonarqube-webhook/
6. Click Save

### Setup sonarqube & gitlab access in jenkins
1. Access Jenkins via browser
2. Manage Jenkins –> Credentials –> Click global –> Click Add credential
3. Select Secret Text for Kind & Global for Scope
4. Insert Sonar-token in ID field text
5. Paste the sonarqube access token in Secret field
6. Click Save

1. Manage Jenkins –> Credentials –> Click global –> Click Add credential
2. Select Gitlab API token for Kind & Global for Scope
3. Paste the sonarqube access token in Secret field
4. Insert gitlab-access-token in ID field text
5. Paste the gitlab access token in Secret field
6. Click Save

### Setup Monorepo App with Nx
```bash
### Setup Volta (JavaScript Tool Manager)
curl https://get.volta.sh | bash
echo "export VOLTA_FEATURE_PNPM=1 >> ~/.zshrc"
### Install node v.18 & pnpm v.8
volta install node@18
node -v
volta install pnpm@8
pnpm -v

## Setup Nx Workspace (Monorepo Base)
pnpm dlx create-nx-workspace@18.0.5 src --pm pnpm --nxCloud skip --preset empty
## Set node version
cd src
volta pin node@18

### Install dependecy for docker image build 
pnpm add -D @nx/nest@18.0.5 @nx/next@18.0.5 @nx/node@18 @nx/esbuild@18.0.5 @nx-tools/nx-container @fastify/mongodb
### Optional install eslint plugin
pnpm add -D @nx/eslint-plugin @nx/eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

### Install Nest depedency (FrontEnd) 
pnpm exec nx g @nx/nest:app mobile-app --customServer -s css --appDir

### Install NextJs API depedency (Backend)
pnpm exec nx g @nx/next:app payment-service --customServer -s css --appDir

### Install Fastify API depedency (Backend) 
pnpm exec nx g @nx/node:app customer-service --customServer --appDir

### Add new shared library for Nest app
pnpm exec nx g @nx/nest:library dashboard --directory dashboard --buildable --importPath @dashboard-lib

### Add new shared library for NextJs service
pnpm exec nx g @nx/next:library payments --directory payments --buildable --importPath @payment-lib

### Add new shared library for Fastify service
pnpm exec nx g @nx/node:library customers --directory /libs/customers --buildable --importPath @customer-lib
```