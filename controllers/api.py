def get_posts():
    posts = []
    rows = db().select(db.post.ALL, orderby=~db.post.created_on)
    for i, r in enumerate(rows):
        t = dict(
            id=r.id,
            user_email=r.user_email,
            title=r.title,
            description=r.description,
            book_price=r.book_price,
            image_url=r.image_url,
            created_by=r.created_by,
            created_on=r.created_on
        )
        posts.append(t)
    return response.json(dict(
        posts=posts,
    ))

@auth.requires_signature()
def add_post():
    user_email = auth.user.email or None
    p_id = db.post.insert(post_content=request.vars.content)
    p = db.post(p_id)
    post = dict(
            id=p.id,
            user_email=p.user_email,
            content=p.post_content,
            created_on=p.created_on,
            is_public=False

    )
    print p
    return response.json(dict(post=post))

@auth.requires_signature()
def edit_post():
    post = db(db.post.id == request.vars.id).select().first()
    post.update_record(post_content=request.vars.post_content)
    print post
    return dict()

@auth.requires_signature()
def del_post():
    db(db.post.id == request.vars.post_id).delete()
    print("its gone")
    return "ok"

@auth.requires_signature()
def toggle_vis():
    print("reached toggle_vis")
    t = db.post(request.vars.post_id)
    t.update_record(is_public = not t.is_public)
    print("toggled")
    return "ok"