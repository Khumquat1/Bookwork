import datetime

db.define_table('post',
                Field('user_email', default=auth.user.email if auth.user_id else None),
                Field('title'),
                Field('description'),
                Field('post_price'),
                Field('image_url'),
                Field('created_by', 'reference auth_user', default=auth.user_id),
                Field('created_on', 'datetime', default=datetime.datetime.utcnow())
                )

db.post.user_email.readable = db.post.user_email.writable = False
db.post.created_on.readable = db.post.created_on.writable = False

