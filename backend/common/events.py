from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Any
import uuid


@dataclass
class Event:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    type: str = ""
    source: str = ""
    time: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    data: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return asdict(self)


class EventPublisher:
    _handlers: dict[str, list[callable]] = {}

    @classmethod
    def register(cls, event_type: str, handler: callable):
        if event_type not in cls._handlers:
            cls._handlers[event_type] = []
        cls._handlers[event_type].append(handler)

    @classmethod
    def publish(cls, event: Event):
        for handler in cls._handlers.get(event.type, []):
            handler(event)
