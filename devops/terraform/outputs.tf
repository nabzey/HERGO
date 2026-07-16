output "front_public_ip" {
  description = "Public IP address of the Front server"
  value       = aws_instance.front.public_ip
}

output "front_private_ip" {
  description = "Private IP address of the Front server"
  value       = aws_instance.front.private_ip
}

output "back_private_ip" {
  description = "Private IP address of the Back server"
  value       = aws_instance.back.private_ip
}

output "db_private_ip" {
  description = "Private IP address of the DB server"
  value       = aws_instance.db.private_ip
}
