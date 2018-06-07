import datetime

db.define_table('post',
                Field('user_email', default=auth.user.email if auth.user_id else None),
<<<<<<< HEAD
                Field('title'),
                Field('description'),
                Field('post_price'),
                Field('image_url'),
                Field('created_by', 'reference auth_user', default=auth.user_id),
                Field('created_on', 'datetime', default=datetime.datetime.utcnow())
                )

db.post.user_email.readable = db.post.user_email.writable = False
=======
                Field('post_content', 'text'),
                Field('is_public', 'boolean', default=False),
                Field('created_on', 'datetime', default=datetime.datetime.utcnow()),
                )


db.post.user_email.readable = db.post.user_email.writable = False
db.post.post_content.requires = IS_NOT_EMPTY()
db.post.is_public.readable = db.post.is_public.writable = False
>>>>>>> 24c2738ede7f1e7bcc4f024438b3e85968550675
db.post.created_on.readable = db.post.created_on.writable = False

