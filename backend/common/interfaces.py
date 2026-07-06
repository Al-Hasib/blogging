from abc import ABC, abstractmethod


class UserServiceInterface(ABC):
    @abstractmethod
    def get_user_display_name(self, user_id: int) -> str | None:
        ...

    @abstractmethod
    def get_user_avatar_url(self, user_id: int) -> str | None:
        ...

    @abstractmethod
    def get_public_user(self, username: str) -> dict | None:
        ...


class BlogServiceInterface(ABC):
    @abstractmethod
    def get_published_post_count(self, user_id: int) -> int:
        ...


class InlineUserService(UserServiceInterface):
    def get_user_display_name(self, user_id: int) -> str | None:
        from django.contrib.auth.models import User
        from services.users.models import Profile
        try:
            profile = Profile.objects.get(user_id=user_id)
            return profile.bangla_display_name or User.objects.get(id=user_id).username
        except Exception:
            return None

    def get_user_avatar_url(self, user_id: int) -> str | None:
        from services.users.models import Profile
        try:
            profile = Profile.objects.get(user_id=user_id)
            return profile.avatar.url if profile.avatar else None
        except Exception:
            return None

    def get_public_user(self, username: str) -> dict | None:
        from django.contrib.auth.models import User
        from services.users.serializers import PublicUserSerializer
        try:
            user = User.objects.get(username=username)
            return PublicUserSerializer(user).data
        except Exception:
            return None


class InlineBlogService(BlogServiceInterface):
    def get_published_post_count(self, user_id: int) -> int:
        from services.blog.models import Post
        return Post.objects.filter(author_id=user_id, status="published").count()
