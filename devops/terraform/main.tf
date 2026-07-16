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

# Utiliser le VPC par défaut d'AWS pour simplifier et éviter les frais réseau supplémentaires
resource "aws_default_vpc" "default" {}

# Utiliser les subnets par défaut
resource "aws_default_subnet" "default_az1" {
  availability_zone = "${var.aws_region}a"
}

# --- Security Group unique pour l'instance ---
resource "aws_security_group" "hergo_sg" {
  name        = "hergo-single-sg"
  description = "Allow HTTP, HTTPS and SSH traffic"
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

  # Optionnel : Port de l'API s'il n'est pas routé par Nginx (port 5000)
  ingress {
    description = "Express API"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Optionnel : Port de preview Frontend (port 8080)
  ingress {
    description = "Frontend Preview"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "hergo-security-group"
  }
}

# --- Instance EC2 unique (comme pour Voyage) ---
resource "aws_instance" "web" {
  ami           = "ami-0705383b065496f55" # Ubuntu Server 22.04 LTS dans la région eu-north-1 (Stockholm)
  instance_type = var.instance_type
  key_name      = var.key_name
  subnet_id     = aws_default_subnet.default_az1.id

  vpc_security_group_ids = [aws_security_group.hergo_sg.id]

  # Allouer un disque de 20 Go (suffisant pour stocker les images Docker et la base de données)
  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "hergo-ec2"
    Role = "single-server"
  }
}
