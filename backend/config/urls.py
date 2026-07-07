from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from services.users.views import PublicUserView
from services.blog.feeds import LatestPostsFeed

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/v1/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),
    path("api/v1/auth/", include("services.users.urls")),
    path("api/v1/users/<username>/", PublicUserView.as_view(), name="user-detail"),
    path("api/v1/", include("services.blog.urls")),
    path("api/v1/", include("services.search.urls")),
    path("rss/", LatestPostsFeed(), name="rss-feed"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
