from celery import shared_task
from django.db.models import Q
from django.contrib.postgres.search import SearchVector
from django.utils.html import strip_tags
import json

BANGLA_WPM = 160

@shared_task
def compute_reading_time(post_id):
    from .models import Post

    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return

    content = post.content
    text = ""
    if isinstance(content, dict):
        text = extract_text_from_tiptap(content)
    elif isinstance(content, str):
        text = strip_tags(content)

    word_count = len(text.split())
    post.reading_time_minutes = max(1, round(word_count / BANGLA_WPM))
    post.save(update_fields=["reading_time_minutes"])

def extract_text_from_tiptap(node):
    texts = []
    if isinstance(node, dict):
        if node.get("type") == "text":
            texts.append(node.get("text", ""))
        for child in (node.get("content") or []):
            texts.append(extract_text_from_tiptap(child))
    return " ".join(texts)

@shared_task
def update_post_search_vector(post_id):
    from .models import Post

    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return

    Post.objects.filter(id=post_id).update(
        search_vector=(
            SearchVector("title", weight="A", config="simple")
            + SearchVector("excerpt", weight="B", config="simple")
            + SearchVector("content_html", weight="C", config="simple")
        )
    )
