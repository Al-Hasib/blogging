from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Post
from .tasks import update_post_search_vector, compute_reading_time
from common.events import Event, EventPublisher

@receiver(post_save, sender=Post)
def post_saved_handler(sender, instance, created, **kwargs):
    if instance.status == Post.Status.PUBLISHED:
        compute_reading_time.delay(instance.id)
        update_post_search_vector.delay(instance.id)
        EventPublisher.publish(Event(
            type="post.published",
            source="blog",
            data={"post_id": instance.id, "slug": instance.slug, "author_id": instance.author_id},
        ))
