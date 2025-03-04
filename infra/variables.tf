variable "aws_region" {
  description = "AWS Region"
  default     = "ap-south-1"
}

variable "cluster_name" {
  description = "ECS Cluster Name"
  default     = "blog-cluster"
}

variable "backend_task_family" {
  description = "ECS Task Family for Backend"
  default     = "blog-backend-task"
}

variable "backend_container_name" {
  description = "Backend Container Name"
  default     = "blog-backend"
}

variable "backend_image" {
  description = "Backend ECR Image URL"
  default     = "000000000000.dkr.ecr.ap-south-1.amazonaws.com/blog-backend:latest"
}

variable "backend_cpu" {
  description = "CPU for backend task"
  default     = 256
}

variable "backend_memory" {
  description = "Memory for backend task"
  default     = 512
}

variable "backend_port" {
  description = "Backend container port"
  default     = 3000
}
