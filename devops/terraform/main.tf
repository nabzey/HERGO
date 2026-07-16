terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# --- VPC par défaut d'AWS (autorisé par les comptes restreints) ---
resource "aws_default_vpc" "default" {}

# --- Sous-réseau par défaut dans la zone de disponibilité A ---
resource "aws_default_subnet" "default_az1" {
  availability_zone = "${var.aws_region}a"
}

# --- Security Groups (Isolation 3-Tier virtuelle) ---
resource "aws_security_group" "front_sg" {
  name        = "hergo-front-sg"
  description = "Security Group for Frontend EC2"
  vpc_id      = aws_default_vpc.default.id

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

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_ip]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "hergo-front-sg"
  }
}

resource "aws_security_group" "back_sg" {
  name        = "hergo-back-sg"
  description = "Security Group for Backend EC2"
  vpc_id      = aws_default_vpc.default.id

  ingress {
    description     = "Express API from Front"
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.front_sg.id]
  }

  ingress {
    description     = "SSH from Front (Jump Host)"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.front_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "hergo-back-sg"
  }
}

resource "aws_security_group" "db_sg" {
  name        = "hergo-db-sg"
  description = "Security Group for DB EC2"
  vpc_id      = aws_default_vpc.default.id

  ingress {
    description     = "PostgreSQL from Back"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.back_sg.id]
  }

  ingress {
    description     = "SSH from Front (Jump Host)"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.front_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "hergo-db-sg"
  }
}

# --- EC2 Instances ---
resource "aws_instance" "front" {
  ami                         = "ami-0705383b065496f55" # Ubuntu 22.04 LTS in eu-north-1
  instance_type               = var.instance_type
  key_name                    = var.key_name
  subnet_id                   = aws_default_subnet.default_az1.id
  vpc_security_group_ids      = [aws_security_group.front_sg.id]
  associate_public_ip_address = true

  root_block_device {
    volume_size = 15
    volume_type = "gp3"
  }

  tags = {
    Name = "hergo-front-ec2"
    Role = "frontend"
  }
}

resource "aws_instance" "back" {
  ami                         = "ami-0705383b065496f55" # Ubuntu 22.04 LTS in eu-north-1
  instance_type               = var.instance_type
  key_name                    = var.key_name
  subnet_id                   = aws_default_subnet.default_az1.id
  vpc_security_group_ids      = [aws_security_group.back_sg.id]
  associate_public_ip_address = true # Nécessaire pour télécharger les images Docker sans NAT Gateway

  root_block_device {
    volume_size = 15
    volume_type = "gp3"
  }

  tags = {
    Name = "hergo-back-ec2"
    Role = "backend"
  }
}

resource "aws_instance" "db" {
  ami                         = "ami-0705383b065496f55" # Ubuntu 22.04 LTS in eu-north-1
  instance_type               = var.instance_type
  key_name                    = var.key_name
  subnet_id                   = aws_default_subnet.default_az1.id
  vpc_security_group_ids      = [aws_security_group.db_sg.id]
  associate_public_ip_address = true # Nécessaire pour télécharger l'image PostgreSQL sans NAT Gateway

  root_block_device {
    volume_size = 15
    volume_type = "gp3"
  }

  tags = {
    Name = "hergo-db-ec2"
    Role = "database"
  }
}

# --- Auto-génération de l'inventaire Ansible ---
resource "local_file" "ansible_inventory" {
  content = <<EOT
[front]
front_host ansible_host=${aws_instance.front.public_ip} ansible_user=ubuntu

[back]
back_host ansible_host=${aws_instance.back.private_ip} ansible_user=ubuntu

[db]
db_host ansible_host=${aws_instance.db.private_ip} ansible_user=ubuntu

[all:vars]
ansible_python_interpreter=/usr/bin/python3

[back:vars]
ansible_ssh_common_args='-o ProxyCommand="ssh -W %h:%p -q -i ~/.ssh/TERRAFORM.pem -o StrictHostKeyChecking=no ubuntu@${aws_instance.front.public_ip}"'

[db:vars]
ansible_ssh_common_args='-o ProxyCommand="ssh -W %h:%p -q -i ~/.ssh/TERRAFORM.pem -o StrictHostKeyChecking=no ubuntu@${aws_instance.front.public_ip}"'
EOT
  filename = "${path.module}/../ansible/inventory.ini"
}
