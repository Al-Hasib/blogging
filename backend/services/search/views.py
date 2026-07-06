from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from django.contrib.postgres.search import (
    SearchQuery,
    SearchRank,
    TrigramSimilarity,
)
from django.db.models import Q
from services.blog.models import Post
from services.blog.serializers import PostListSerializer

class SearchView(generics.ListAPIView):
    serializer_class = PostListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        query = self.request.query_params.get("q", "").strip()
        if not query:
            return Post.objects.none()

        qs = Post.objects.filter(status="published").select_related(
            "author__profile", "category"
        )

        search_query = SearchQuery(query, config="simple")
        trigram = TrigramSimilarity("title", query)

        qs = qs.annotate(
            rank=SearchRank("search_vector", search_query) + trigram
        ).filter(
            Q(search_vector=search_query)
            | Q(title__trigram_similar=query)
            | Q(excerpt__trigram_similar=query)
        ).order_by("-rank")

        return qs
