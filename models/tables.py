# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

import datetime

db.define_table('user_images',
                Field('user_email', default=auth.user.email if auth.user_id else None),
                Field('show_email','boolean', default=False),
                Field('phone_number'),
                Field('call_ok', 'boolean', default = False),
                Field('text_ok','boolean', default = False),
                Field('title'),
                Field('description'),
                Field('image_price', 'float', default = '0.0'),
                Field('image_url', 'list:string'),
                Field('created_by', 'reference auth_user', default=auth.user_id),
                Field('created_on', 'datetime', default=datetime.datetime.utcnow()),
                )


db.define_table('users',
                Field('user_email'),
                Field('follows', 'list:string')
)



# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
