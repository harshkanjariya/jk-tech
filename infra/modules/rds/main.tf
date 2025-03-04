resource "aws_db_instance" "postgres" {
  identifier = "my-postgres-db"
  engine = "postgres"
  instance_class = "db.t3.micro"
  allocated_storage = 20
  db_name = var.db_name
  username = var.db_username
  password = var.db_password
  publicly_accessible = false
  skip_final_snapshot = true
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
}
