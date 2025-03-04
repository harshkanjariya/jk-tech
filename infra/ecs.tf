resource "aws_ecs_cluster" "blog_cluster" {
  name = var.cluster_name
}

resource "aws_ecs_task_definition" "blog_backend" {
  family                   = var.backend_task_family
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.backend_cpu
  memory                   = var.backend_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = var.backend_container_name,
      image     = var.backend_image,
      cpu       = var.backend_cpu,
      memory    = var.backend_memory,
      essential = true,
      portMappings = [
        {
          containerPort = var.backend_port,
          hostPort      = var.backend_port
        }
      ]
    }
  ])
}
