from django.test import TestCase
from django.contrib.auth.models import User
from .models import Profile

class ProfileTests(TestCase):
    def test_profile_created_on_user_creation(self):
        user = User.objects.create_user(username="testuser", password="pass1234")
        self.assertTrue(hasattr(user, "profile"))
        self.assertIsNotNone(user.profile)

    def test_profile_str_method(self):
        user = User.objects.create_user(username="testuser", password="pass1234")
        user.profile.bangla_display_name = "জন দো"
        user.profile.save()
        self.assertEqual(str(user.profile), "জন দো")

    def test_profile_str_fallback_to_username(self):
        user = User.objects.create_user(username="testuser", password="pass1234")
        self.assertEqual(str(user.profile), "testuser")
