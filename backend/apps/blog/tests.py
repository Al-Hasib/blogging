from django.test import TestCase
from django.contrib.auth.models import User
from .models import Category, Post

class SlugGenerationTests(TestCase):
    def test_bangla_slug_generated_from_title(self):
        user = User.objects.create_user(username="testuser", password="pass1234")
        post = Post.objects.create(
            title="পাইথন প্রোগ্রামিং টিউটোরিয়াল",
            author=user,
            content={"type": "doc", "content": []},
        )
        self.assertTrue(post.slug)
        # Slug should contain Unicode Bangla characters, not be empty/garbled
        self.assertIn("পাইথন", post.slug)

    def test_english_slug_fallback(self):
        user = User.objects.create_user(username="testuser", password="pass1234")
        post = Post.objects.create(
            title="Python Programming Tutorial",
            author=user,
            content={"type": "doc", "content": []},
        )
        self.assertEqual(post.slug, "python-programming-tutorial")

    def test_category_bangla_slug(self):
        cat = Category.objects.create(name_bn="প্রোগ্রামিং", name_en="Programming")
        self.assertTrue(cat.slug)
        self.assertIn("প্রোগ্রামিং", cat.slug)

    def test_unique_slug(self):
        user = User.objects.create_user(username="testuser", password="pass1234")
        Post.objects.create(
            title="Unique Title", author=user, content={"type": "doc", "content": []}
        )
        with self.assertRaises(Exception):
            Post.objects.create(
                title="Unique Title", author=user, content={"type": "doc", "content": []}
            )

    def test_reading_time_default(self):
        user = User.objects.create_user(username="testuser", password="pass1234")
        post = Post.objects.create(
            title="Test Post", author=user, content={"type": "doc", "content": []}
        )
        self.assertEqual(post.reading_time_minutes, 1)

    def test_published_at_set_on_publish(self):
        user = User.objects.create_user(username="testuser", password="pass1234")
        post = Post.objects.create(
            title="Publish Test",
            author=user,
            content={"type": "doc", "content": []},
            status=Post.Status.PUBLISHED,
        )
        self.assertIsNotNone(post.published_at)

    def test_draft_has_no_published_at(self):
        user = User.objects.create_user(username="testuser", password="pass1234")
        post = Post.objects.create(
            title="Draft Test",
            author=user,
            content={"type": "doc", "content": []},
            status=Post.Status.DRAFT,
        )
        self.assertIsNone(post.published_at)
