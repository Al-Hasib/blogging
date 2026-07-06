from django.apps import AppConfig

class BlogConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "services.blog"
    label = "blog"

    def ready(self):
        import services.blog.signals
