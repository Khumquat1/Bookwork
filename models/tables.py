import datetime

db.define_table('post',
                Field('user_email', default=auth.user.email if auth.user_id else None),
                Field('post_content', 'text'),
                Field('is_public', 'boolean', default=False),
                Field('created_on', 'datetime', default=datetime.datetime.utcnow()),
                )


db.post.user_email.readable = db.post.user_email.writable = False
db.post.post_content.requires = IS_NOT_EMPTY()
db.post.is_public.readable = db.post.is_public.writable = False
db.post.created_on.readable = db.post.created_on.writable = False

