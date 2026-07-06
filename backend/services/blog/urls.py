from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"posts", views.PostViewSet)
router.register(r"categories", views.CategoryViewSet)
router.register(r"bookmarks", views.BookmarkViewSet, basename="bookmark")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "posts/<slug:post_slug>/comments/",
        views.CommentViewSet.as_view({"get": "list", "post": "create"}),
        name="post-comments",
    ),
    path(
        "comments/<int:pk>/",
        views.CommentViewSet.as_view({"delete": "destroy"}),
        name="comment-detail",
    ),
    path("upload/image/", views.ImageUploadView.as_view(), name="image-upload"),
]
