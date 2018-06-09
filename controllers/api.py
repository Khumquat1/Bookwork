import tempfile
import traceback

# Cloud-safe of uuid, so that many cloned servers do not all use the same uuids.
from gluon.utils import web2py_uuid
def get_user_name_from_email(email):
    """Returns a string corresponding to the user first and last names,
    given the user email."""
    u = db(db.auth_user.email == email).select().first()

    if u is None:
        return 'None'
    else:
        return [u.first_name, u.last_name]



def get_images():
    images = []
    users=[]
    seen=set(users)
    rows = db().select(db.user_images.ALL)
    rows_2 = db().select(db.users.ALL)
    for i, r in enumerate(rows):
        t = dict(
            id=r.id,
            image_url=r.image_url,
            user_email=r.user_email,
            created_on=r.created_on,
            image_price=r.image_price,
            title=r.title,
            description=r.description,
            phone_number=r.phone_number,
            text_ok = r.text_ok,
            call_ok = r.call_ok,
            show_email = r.show_email
            )
        images.append(t)
    for i, r in enumerate(rows_2):
        if r.user_email not in seen:
            t = dict(
                id=r.id,
                user_email=r.user_email,
                )
            seen.add(r.user_email)
            users.append(t)
    print(users)
    return response.json(dict(user_images=images, users=users))

def get_sorted_images():
    sortby = db.user_images.title
    print('recieved flag '+request.vars.flag)
    images = []
    if request.vars.flag is '1':
        print("sort by recent")
        sortby = db.user_images.created_on
    if request.vars.flag is '2':
        print("sort by cost up")
        sortby = ~db.user_images.image_price
    if request.vars.flag is '3':
        print("sort by cost down")
        sortby = db.user_images.image_price
    rows = db().select(db.user_images.ALL, orderby=sortby)
    for i, r in enumerate(rows):
        t = dict(
            id=r.id,
            image_url=r.image_url,
            user_email=r.user_email,
            created_on=r.created_on,
            image_price=r.image_price,
            title=r.title,
            description=r.description,
            phone_number=r.phone_number,
            text_ok = r.text_ok,
            call_ok = r.call_ok,
            show_email = r.show_email
            )
        images.append(t)
    return response.json(dict(user_images=images))


def log_user():
    if auth.user is not None:
        grabbed_user = auth.user.email
        found = False;
        rows = db().select(db.users.ALL)
        for i,r in enumerate(rows):
            if grabbed_user == r.user_email:
                found= True
                break
        if not found:
            print("logged a new user")
            u_id = db.users.insert(user_email = grabbed_user)
            us = db.users(u_id)
            users = dict(user_email = grabbed_user)
            return response.json(dict(current_user=grabbed_user, users=users))
        return response.json(dict(current_user=grabbed_user))

def get_follows():
    follows = []
    rows = db().select(db.follows.ALL)
    for i, r in enumerate(rows):
        t = dict(
            followed_image_id=r.followed_image_id,
            user_id=r.user_id,
            )
        follows.append(t)
    print follows
    return response.json(dict(follows=follows))


@auth.requires_signature()
def follow():
    current_user = auth.user.email
    rows = db().select(db.users.ALL)
    print rows
    return "ok"



@auth.requires_signature()
def add_image():
    image_id = db.user_images.insert(
        image_url = request.vars.image_url,
        show_email=request.vars.show_email,
        image_price=request.vars.image_price,
        description=request.vars.description,
        title=request.vars.title,
        phone_number = request.vars.phone_number,
        text_ok=request.vars.text_ok,
        call_ok=request.vars.call_ok

    )
    im = db.user_images(image_id)
    name = get_user_name_from_email(im.user_email)
    user_images = dict(
        user_email=im.user_email,
        show_email=request.vars.show_email,
        id=im.id,
        image_url=request.vars.image_url,
        image_price=request.vars.image_price,
        first_name=name[0],
        last_name=name[1],
        description=request.vars.description,
        title=request.vars.title,
        phone_number=request.vars.phone_number,
        text_ok = request.vars.text_ok,
        call_ok = request.vars.call_ok

    )
    print(user_images)
    return response.json(dict(user_images=user_images))

def add_image_np():
    image_id = db.user_images.insert(
        image_price=request.vars.image_price,
        show_email=request.vars.show_email,
        description=request.vars.description,
        title=request.vars.title,
        phone_number = request.vars.phone_number,
        text_ok=request.vars.text_ok,
        call_ok=request.vars.call_ok

    )
    im = db.user_images(image_id)
    name = get_user_name_from_email(im.user_email)
    user_images = dict(
        user_email=im.user_email,
        show_email=request.vars.show_email,
        phone_number=request.vars.phone_number,
        id=im.id,
        image_url=request.vars.image_url,
        first_name=name[0],
        last_name=name[1],
        description=request.vars.description,
        title=request.vars.title,
        text_ok=request.vars.text_ok,
        call_ok=request.vars.call_ok

    )
    print(user_images)
    return response.json(dict(user_images=user_images))

@auth.requires_signature()
def set_price():
    db(db.user_images.id == request.vars.user_image_id).update(
        image_price = request.vars.new_price
    )
    print("new price of image id " + request.vars.user_image_id + " is "+ request.vars.new_price)
    print(db.user_images[request.vars.user_image_id])
    return "ok"

@auth.requires_signature()
def del_post():
    db(db.user_images.id == request.vars.post_id).delete()
    print("picture gone")
    return "ok"

@auth.requires_signature()
def unfollow():
    db(db.follows.id == request.vars.post_id).delete()
    print("unfollowed so its gone")
    return "ok"



