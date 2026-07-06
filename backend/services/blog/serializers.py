from rest_framework import serializers
from taggit.serializers import TaggitSerializer, TagListSerializerField
from .models import Post, Category, Comment, Bookmark

class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name_bn", "name_en", "slug", "description", "post_count"]

    def get_post_count(self, obj):
        return obj.posts.filter(status="published").count()

class PostListSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    tags = TagListSerializerField()

    class Meta:
        model = Post
        fields = [
            "id", "title", "slug", "author", "author_name",
            "excerpt", "cover_image", "category", "category_name",
            "tags", "status", "published_at", "reading_time_minutes",
            "views_count", "created_at", "updated_at",
        ]
        read_only_fields = ["author", "views_count"]

    def get_author_name(self, obj):
        profile = obj.author.profile
        return profile.bangla_display_name or obj.author.username

    def get_category_name(self, obj):
        if obj.category:
            return obj.category.name_bn
        return None

class PostDetailSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    tags = TagListSerializerField()

    class Meta:
        model = Post
        fields = [
            "id", "title", "slug", "author", "author_name", "author_avatar",
            "content", "content_html", "excerpt", "cover_image",
            "category", "category_name", "tags", "status",
            "published_at", "reading_time_minutes", "views_count",
            "created_at", "updated_at",
        ]
        read_only_fields = ["author", "views_count"]

    def get_author_name(self, obj):
        profile = obj.author.profile
        return profile.bangla_display_name or obj.author.username

    def get_author_avatar(self, obj):
        if obj.author.profile.avatar:
            return obj.author.profile.avatar.url
        return None

    def get_category_name(self, obj):
        if obj.category:
            return obj.category.name_bn
        return None

class PostWriteSerializer(TaggitSerializer, serializers.ModelSerializer):
    tags = TagListSerializerField(required=False)

    class Meta:
        model = Post
        fields = [
            "title", "content", "content_html", "excerpt",
            "cover_image", "category", "tags", "status",
        ]

    def validate_title(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters.")
        return value

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id", "post", "author", "author_name", "author_avatar",
            "parent", "body", "is_deleted", "created_at", "updated_at", "replies",
        ]
        read_only_fields = ["author", "is_deleted", "post"]

    def get_author_name(self, obj):
        profile = obj.author.profile
        return profile.bangla_display_name or obj.author.username

    def get_author_avatar(self, obj):
        if obj.author.profile.avatar:
            return obj.author.profile.avatar.url
        return None

    def get_replies(self, obj):
        replies = obj.replies.filter(is_deleted=False)
        return CommentSerializer(replies, many=True).data

class BookmarkSerializer(serializers.ModelSerializer):
    post_detail = PostListSerializer(source="post", read_only=True)

    class Meta:
        model = Bookmark
        fields = ["id", "post", "post_detail", "created_at"]
        read_only_fields = ["user"]

    def validate(self, data):
        user = self.context["request"].user
        post = data["post"]
        if Bookmark.objects.filter(user=user, post=post).exists():
            raise serializers.ValidationError("Already bookmarked.")
        return data
