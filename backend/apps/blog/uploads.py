from rest_framework import permissions, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB

class ImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file = request.FILES.get("image")
        if not file:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

        if file.content_type not in ALLOWED_IMAGE_TYPES:
            return Response(
                {"error": "Invalid image type. Allowed: JPEG, PNG, WebP, GIF"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if file.size > MAX_IMAGE_SIZE:
            return Response(
                {"error": "Image too large. Max 5MB"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        from django.core.files.storage import default_storage
        path = default_storage.save(f"uploads/{file.name}", file)
        url = default_storage.url(path)

        return Response({"url": url}, status=status.HTTP_201_CREATED)
