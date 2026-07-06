from django.contrib.syndication.views import Feed
from django.urls import reverse
from django.utils.feedgenerator import Rss201rev2Feed
from .models import Post

class UTF8RssFeed(Rss201rev2Feed):
    def rss_attributes(self):
        attrs = super().rss_attributes()
        attrs["encoding"] = "UTF-8"
        return attrs

class LatestPostsFeed(Feed):
    feed_type = UTF8RssFeed
    title = "বাংলা টেক ব্লগ - সর্বশেষ পোস্ট"
    link = "/"
    description = "বাংলায় প্রোগ্রামিং, প্রযুক্তি ও ডেভেলপমেন্ট বিষয়ক সর্বশেষ পোস্ট"

    def items(self):
        return Post.objects.filter(status="published").order_by("-published_at")[:20]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.excerpt or item.content_html[:200] if item.content_html else ""

    def item_link(self, item):
        return reverse("post-detail", kwargs={"slug": item.slug})

    def item_pubdate(self, item):
        return item.published_at
