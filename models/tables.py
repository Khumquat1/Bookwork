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
                Field('image_price'),
                Field('image_url', default=
                "https://storage.googleapis.com/luca-teaching-images/3d2b1006-3e9d-4960-87c0-5bc3668544b4.jpg?Expires=1559898164&GoogleAccessId=image-uploader%40luca-teaching.iam.gserviceaccount.com&Signature=WpEwZFdMU0nWrTIn8NOQFNJg9MschjQJDpl6BIfWGUYo02G2YTk%2Bz66PvbLfr%2BR8TUJdl7Lk%2BX6TGRm0eeDTjjxVDr6GvslR2CWxAa35GZuBKycgXmCHITrR7n96z3Wzk7mXBsB3n0ks0BIYZUQ%2FXjFWL3BqsHTlpy1Hh0SfkR9PjTdpFBpKpE8ttLcZ%2BsBTlZvCE1hXRfA4j9CVxF%2FCPkqbiQUq5ecoOzL7TdrU3E8tFd4d3IeMIg5HT2Cp8p0etKscCgnyu650Cvxkj%2FrDMVmzjZFyXB0ZBLIRMivyhu7tm7hsSaVwxIFxKk%2BesrQDryp4BtdKqvXGAIV%2BWN3Nvg%3D%3D"),
                Field('created_by', 'reference auth_user', default=auth.user_id),
                Field('created_on', 'datetime', default=datetime.datetime.utcnow()),
                )


db.define_table('users',
                Field('user_email'),
                Field('follows')
)



# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
