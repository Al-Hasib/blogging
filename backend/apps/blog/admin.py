from django.contrib import admin
from .models import Category, Post, Comment, Bookmark

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name_bn",)}
    list_display = ["name_bn", "name_en", "slug"]
    search_fields = ["name_bn", "name_en"]

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "status", "category", "reading_time_minutes", "created_at"]
    list_filter = ["status", "category", "created_at"]
    search_fields = ["title", "excerpt"]
    prepopulated_fields = {"slug": ("title",)}

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ["author", "post", "is_deleted", "created_at"]
    list_filter = ["is_deleted", "created_at"]

@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ["user", "post", "created_at"]
