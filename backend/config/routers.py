SERVICE_DB_MAP = {
    "auth_service": "auth_db",
    "users": "user_db",
    "blog": "blog_db",
    "search": "blog_db",
}


class ServiceDatabaseRouter:
    def db_for_read(self, model, **hints):
        return SERVICE_DB_MAP.get(model._meta.app_label)

    def db_for_write(self, model, **hints):
        return SERVICE_DB_MAP.get(model._meta.app_label)

    def allow_relation(self, obj1, obj2, **hints):
        db1 = SERVICE_DB_MAP.get(obj1._meta.app_label)
        db2 = SERVICE_DB_MAP.get(obj2._meta.app_label)
        return db1 == db2

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        target = SERVICE_DB_MAP.get(app_label)
        if target is None:
            return db == "default"
        return db == target
