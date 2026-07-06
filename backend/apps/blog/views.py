from rest_framework import viewsets, permissions, filters, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser
from django.db.models import Q, F
from .models import Post, Category, Comment, Bookmark
from .serializers import (
    PostListSerializer,
    PostDetailSerializer,
    PostWriteSerializer,
    CategorySerializer,
    CommentSerializer,
    BookmarkSerializer,
)
from .uploads import ImageUploadView

class IsAuthorOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user or request.user.is_staff

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    lookup_field = "slug"
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "excerpt", "content_html"]

    def get_serializer_class(self):
        if self.action == "list":
            return PostListSerializer
        elif self.action in ("create", "update", "partial_update"):
            return PostWriteSerializer
        return PostDetailSerializer

    def get_permissions(self):
        if self.action in ("create",):
            return [permissions.IsAuthenticated()]
        elif self.action in ("update", "partial_update", "destroy"):
            return [permissions.IsAuthenticated(), IsAuthorOrAdmin()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = Post.objects.select_related("author__profile", "category")
        if self.action == "list":
            status_filter = self.request.query_params.get("status")
            if status_filter:
                qs = qs.filter(status=status_filter)
            elif self.request.user.is_authenticated:
                qs = qs.filter(
                    Q(status="published")
                    | Q(author=self.request.user)
                )
            else:
                qs = qs.filter(status="published")
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=["post"])
    def publish(self, request, slug=None):
        post = self.get_object()
        if post.author != request.user and not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        post.status = Post.Status.PUBLISHED
        post.save()
        return Response({"status": "published"})

    @action(detail=True, methods=["post"])
    def autosave(self, request, slug=None):
        post = self.get_object()
        if post.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = PostWriteSerializer(post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"status": "saved"})

    @action(detail=True, methods=["post"])
    def view(self, request, slug=None):
        post = self.get_object()
        Post.objects.filter(id=post.id).update(views_count=F("views_count") + 1)
        return Response({"views_count": post.views_count + 1})

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.IsAuthenticated()]
        elif self.action in ("destroy",):
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Comment.objects.filter(
            post__slug=self.kwargs["post_slug"],
            parent=None,
            is_deleted=False,
        ).select_related("author__profile")

    def perform_create(self, serializer):
        post = generics.get_object_or_404(
            Post.objects.filter(status="published"),
            slug=self.kwargs["post_slug"],
        )
        serializer.save(author=self.request.user, post=post)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.author != request.user and not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        instance.is_deleted = True
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class BookmarkViewSet(viewsets.ModelViewSet):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["delete"])
    def remove(self, request):
        post_id = request.data.get("post")
        Bookmark.objects.filter(user=request.user, post_id=post_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
