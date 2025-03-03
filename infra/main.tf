provider "aws" {
  region = "ap-south-1"
}

resource "aws_ecs_cluster" "blog_cluster" {
  name = "blog-cluster"
}

resource "aws_ecs_task_definition" "blog_backend" {
  family = "blog-backend-task"
  container_definitions = jsonencode([
    {
      name      = "blog-backend",
      image     = "000000000000.dkr.ecr.ap-south-1.amazonaws.com/blog-backend:latest",
      cpu       = 256,
      memory    = 512,
      essential = true,
      portMappings = [
        {
          containerPort = 3000,
          hostPort      = 3000
        }
      ]
    }
  ])
}
