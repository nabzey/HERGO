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

# --- VPC ---
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "hergo-vpc"
  }
}

# --- Subnets ---
resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "hergo-public-subnet"
  }
}

resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "hergo-private-subnet"
  }
}

# --- Gateways ---
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "hergo-igw"
  }
}

resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "hergo-nat-eip"
  }
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public.id

  tags = {
    Name = "hergo-nat-gateway"
  }

  depends_on = [aws_internet_gateway.igw]
}

# --- Route Tables ---
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "hergo-public-route-table"
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "hergo-private-route-table"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  subnet_id      = aws_subnet.private.id
  route_table_id = aws_route_table.private.id
}

# --- Security Groups ---
resource "aws_security_group" "front_sg" {
  name        = "hergo-front-sg"
  description = "Security Group for Frontend EC2"
  vpc_id      = aws_vpc.main.id

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
  vpc_id      = aws_vpc.main.id

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
  vpc_id      = aws_vpc.main.id

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
  subnet_id                   = aws_subnet.public.id
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
  subnet_id                   = aws_subnet.private.id
  vpc_security_group_ids      = [aws_security_group.back_sg.id]
  associate_public_ip_address = false

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
  subnet_id                   = aws_subnet.private.id
  vpc_security_group_ids      = [aws_security_group.db_sg.id]
  associate_public_ip_address = false

  root_block_device {
    volume_size = 15
    volume_type = "gp3"
  }

  tags = {
    Name = "hergo-db-ec2"
    Role = "database"
  }
}

# --- Auto-generate Ansible Inventory ---
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

