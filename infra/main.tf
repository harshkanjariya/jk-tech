module "s3" {
  source = "./modules/s3"
  bucket_name = "frontend.example.com"
}

module "s3" {
  source = "./modules/s3"
  bucket_name = "tinymce.example.com"
}

module "rds" {
  source = "./modules/rds"
  db_name = "blog-db"
  db_username = "blog_root_admin"
  db_password = "randompassword"
}
