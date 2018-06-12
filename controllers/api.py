import tempfile
import traceback

# Cloud-safe of uuid, so that many cloned servers do not all use the same uuids.
from gluon.utils import web2py_uuid
def get_images():
    images = []
    users=[]
    seen=set(users)
    rows = db().select(db.user_images.ALL, orderby = ~db.user_images.created_on)
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
            show_email = r.show_email,
            following_users=r.following_users
            )
        images.append(t)
    for i, r in enumerate(rows_2):
        if r.user_email not in seen:
            t = dict(
                id=r.id,
                user_email=r.user_email,
                follow_ids=r.follow_ids
                )
            seen.add(r.user_email)
            users.append(t)
   # print(images)
    return response.json(dict(user_images=images, users=users))

def get_sorted_images():
    sortby = ~db.user_images.created_on
    # print('recieved flag '+request.vars.flag)
    images = []
    if request.vars.flag is '1':
        #  print("sort by recent")
        sortby = ~db.user_images.created_on
    if request.vars.flag is '2':
        #  print("sort by cost up")
        sortby = ~db.user_images.image_price
    if request.vars.flag is '3':
        #  print("sort by cost down")
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
            show_email = r.show_email,
            following_users = r.following_users
            )
        images.append(t)
    return response.json(dict(user_images=images))

def get_follows():
    current_user = request.vars.user
    #  print("getting follows for ", request.vars.user )
    user_images = []
    rows = db().select(db.user_images.ALL)
    for i,r in enumerate(rows):
        if r.following_users:
            if current_user in r.following_users:
                #   print("current user is follow id ",r.id)
                t = dict(
                    id=r.id,
                    image_url=r.image_url,
                    user_email=r.user_email,
                    created_on=r.created_on,
                    image_price=r.image_price,
                    title=r.title,
                    description=r.description,
                    phone_number=r.phone_number,
                    text_ok=r.text_ok,
                    call_ok=r.call_ok,
                    show_email=r.show_email,
                    following_users=r.following_users
                )
                user_images.append(t)
    return response.json(dict(user_images=user_images))

def get_own():
    current_user = request.vars.user
    # print("getting pics from ", request.vars.user )
    user_images = []
    rows = db().select(db.user_images.ALL)
    for i,r in enumerate(rows):
        if current_user == r.user_email:
            t = dict(
                 id=r.id,
                 image_url=r.image_url,
                 user_email=r.user_email,
                 created_on=r.created_on,
                 image_price=r.image_price,
                 title=r.title,
                 description=r.description,
                 phone_number=r.phone_number,
                 text_ok=r.text_ok,
                 call_ok=r.call_ok,
                 show_email=r.show_email,
                 following_users=r.following_users
            )
            user_images.append(t)
    return response.json(dict(user_images=user_images))



def log_user():
    if auth.user is not None:
        grabbed_user = auth.user.email
        found = False
        rows = db().select(db.users.ALL)
        for i,r in enumerate(rows):
            if grabbed_user == r.user_email:
                found= True
                break
        if not found:
            #print("logged a new user")
            u_id = db.users.insert(user_email = grabbed_user)
            us = db.users(u_id)
            users = dict(user_email = grabbed_user, follows = ())
            return response.json(dict(current_user=grabbed_user, users=users))
        return response.json(dict(current_user=grabbed_user))
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
    user_images = dict(
        user_email=im.user_email,
        show_email=request.vars.show_email,
        id=im.id,
        image_url=request.vars.image_url,
        image_price=request.vars.image_price,
        description=request.vars.description,
        title=request.vars.title,
        phone_number=request.vars.phone_number,
        text_ok = request.vars.text_ok,
        call_ok = request.vars.call_ok,

    )
    #print(user_images)
    return response.json(dict(user_images=user_images))

@auth.requires_signature()
def update_post():
    if(request.vars.image_url):
        # print('image change')
        db(db.user_images.id == request.vars.post_id).update(
            show_email=request.vars.show_email,
            image_url=request.vars.image_url,
            image_price=request.vars.image_price,
            description=request.vars.description,
            title=request.vars.title,
            phone_number=request.vars.phone_number,
            text_ok=request.vars.text_ok,
            call_ok=request.vars.call_ok,
        )
    else:
        #  print('no image change: ', request.vars.image_url);
        db(db.user_images.id == request.vars.post_id).update(
            show_email=request.vars.show_email,
            image_price=request.vars.image_price,
            description=request.vars.description,
            title=request.vars.title,
            phone_number=request.vars.phone_number,
            text_ok=request.vars.text_ok,
            call_ok=request.vars.call_ok,
        )
    #  print("updated post with new details")
    return "ok"

@auth.requires_signature()
def follow():
    current_user = request.vars.user
    temp_follows = []
    temp = db(db.user_images.id == request.vars.image_id).select().first()
    flag = request.vars.flag
    rows = db().select(db.user_images.ALL)
    for i, r in enumerate(rows):
        temp_id = str(r.id)
        if temp_id == request.vars.image_id:
            if r.following_users:
                temp_follows.extend(r.following_users)
                # print("following ", temp_follows)
            if flag is '0':
                if temp_follows.count(current_user) != 0:
                    # print("already followed")
                    break
                    # print(current_user , ' is now following id: ', temp_id)
                temp_follows.append(current_user)
            if flag is '1':
                # print("removing user follow: ",current_user)
                if temp_follows.count(current_user) == 0:
                    # print("no instance found")
                    break
                    #print(current_user , ' unfollowed id: ' , temp_id)
                temp_follows.remove(current_user)
                #else:
                #  print(temp_id , " didn't match " , request.vars.image_id)
        #print ("list of followers ", temp_follows)
    db(db.user_images.id == request.vars.image_id).update(
        following_users = temp_follows
    )
    return "ok"

@auth.requires_signature()
def del_post():
    db(db.user_images.id == request.vars.post_id).delete()
    #print("picture gone")
    return "ok"



