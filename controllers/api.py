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
            user_phone=r.user_phone,
            )
        images.append(t)
    for i, r in enumerate(rows_2):
        t = dict(
            id=r.id,
            user_email=r.user_email,
            follows=r.follows,
            )
        users.append(t)
    return response.json(dict(user_images=images))


def log_user():
    if auth.user is not None:
        grabbed_user = auth.user.email
        new_user = True
        users = []
        rows = db().select(db.users.ALL)
        print("current users: ", rows)
        for row in db(db.users.user_email == grabbed_user).select():
            new_user = False
            print("repeat user logged ", grabbed_user)
        if new_user:
            print("new user found")
            image_id = db.users.insert(user_email=grabbed_user)
            im = db.users(image_id)
            users = dict(user_email=grabbed_user)
        print(users)
        return response.json(dict(current_user=grabbed_user, users=users))

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
def add_image():
    image_id = db.user_images.insert(
        image_url = request.vars.image_url,
        image_price=request.vars.image_price,
        description=request.vars.description,
        title=request.vars.title,

    )
    im = db.user_images(image_id)
    name = get_user_name_from_email(im.user_email)
    user_images = dict(
        user_email=im.user_email,
        user_phone=im.user_phone,
        id=im.id,
        image_url=request.vars.image_url,
        image_price=request.vars.image_price,
        first_name=name[0],
        last_name=name[1],
        description=request.vars.description,
        title=request.vars.title,

    )
    print(user_images)
    return response.json(dict(user_images=user_images))

def add_image_np():
    image_id = db.user_images.insert(
        image_price=request.vars.image_price,
        description=request.vars.description,
        title=request.vars.title,

    )
    im = db.user_images(image_id)
    name = get_user_name_from_email(im.user_email)
    user_images = dict(
        user_email=im.user_email,
        user_phone=im.user_phone,
        id=im.id,
        image_url=request.vars.image_url,
        first_name=name[0],
        last_name=name[1],
        description=request.vars.description,
        title=request.vars.title,

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



