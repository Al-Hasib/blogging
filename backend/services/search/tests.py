from django.test import TestCase

class SearchViewTests(TestCase):
    def test_search_requires_query(self):
        response = self.client.get("/api/v1/search/")
        self.assertEqual(response.status_code, 200)
