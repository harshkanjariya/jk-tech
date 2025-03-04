output "ecs_cluster_name" {
  value = aws_ecs_cluster.blog_cluster.name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.blog_backend.repository_url
}
