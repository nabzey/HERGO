variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "eu-north-1" # Stockholm (votre région AWS active)
}

variable "instance_type" {
  description = "EC2 Instance type"
  type        = string
  default     = "t3.micro" # Recommandé pour Stockholm (t2.micro n'est pas disponible ou moins performant)
}

variable "admin_ip" {
  description = "Administrator IP address for SSH access"
  type        = string
  default     = "0.0.0.0/0" # Autorise SSH depuis n'importe où par défaut
}

variable "key_name" {
  description = "Name of the SSH key pair to use for EC2 instances"
  type        = string
  default     = "hergo-key" # À remplacer par le nom de votre clé existante (ex: "terraform" ou autre)
}
