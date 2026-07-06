from django.db import migrations, models
import django.db.models.deletion
import django.contrib.postgres.search
import django.contrib.postgres.operations
import taggit.managers

class Migration(migrations.Migration):
    initial = True
    dependencies = [
        ("taggit", "0001_initial"),
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        django.contrib.postgres.operations.TrigramExtension(),

        migrations.CreateModel(
            name="Category",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name_bn", models.CharField(max_length=100)),
                ("name_en", models.CharField(blank=True, max_length=100)),
                ("slug", models.SlugField(allow_unicode=True, max_length=120, unique=True)),
                ("description", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "verbose_name_plural": "categories",
                "ordering": ["name_bn"],
            },
        ),

        migrations.CreateModel(
            name="Post",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=300)),
                ("slug", models.SlugField(allow_unicode=True, max_length=350, unique=True)),
                ("content", models.JSONField(default=dict)),
                ("content_html", models.TextField(blank=True)),
                ("excerpt", models.TextField(blank=True, max_length=500)),
                ("cover_image", models.ImageField(blank=True, upload_to="covers/")),
                ("status", models.CharField(choices=[("draft", "Draft"), ("in_review", "In Review"), ("published", "Published")], default="draft", max_length=20)),
                ("published_at", models.DateTimeField(blank=True, null=True)),
                ("reading_time_minutes", models.PositiveIntegerField(default=1)),
                ("views_count", models.PositiveIntegerField(default=0)),
                ("search_vector", django.contrib.postgres.search.SearchVectorField(null=True, editable=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("author", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="posts", to="auth.user")),
                ("category", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="posts", to="blog.category")),
                ("tags", taggit.managers.TaggableManager(blank=True, help_text="A comma-separated list of tags.", through="taggit.TaggedItem", to="taggit.Tag", verbose_name="Tags")),
            ],
            options={
                "ordering": ["-created_at"],
                "indexes": [
                    models.Index(fields=["status", "-published_at"], name="blog_post_status_published_idx"),
                    models.Index(fields=["slug"], name="blog_post_slug_idx"),
                ],
            },
        ),

        migrations.CreateModel(
            name="Comment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("body", models.TextField()),
                ("is_deleted", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("author", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="comments", to="auth.user")),
                ("parent", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="replies", to="blog.comment")),
                ("post", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="comments", to="blog.post")),
            ],
            options={
                "ordering": ["created_at"],
            },
        ),

        migrations.CreateModel(
            name="Bookmark",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("post", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="bookmarks", to="blog.post")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="bookmarks", to="auth.user")),
            ],
            options={
                "ordering": ["-created_at"],
                "unique_together": {("user", "post")},
            },
        ),
    ]
