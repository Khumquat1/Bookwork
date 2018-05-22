def get_posts():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    posts = []
    has_more = False

    rows = db().select(db.post.ALL, orderby=~db.post.created_on, limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        t = dict(
            id=r.id,
            user_email=r.user_email,
            content=r.post_content,
            created_on=r.created_on,
            is_public=r.is_public
        )
        posts.append(t)
    logged_in = auth.user_id is not None
    return response.json(dict(
        posts=posts,
        logged_in=logged_in,
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