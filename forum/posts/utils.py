def get_post_images(request_data):
    images = []
    for i in range(len(request_data)-2):
        image = request_data.get(f'images[{i}]')
        if not image: break
        images.append(image)
    return images

def get_post_content(post_type, request_data): 
    if post_type == 'text':
        return ('text', request_data.get('text'))
    elif post_type == 'link':
        return ('link', request_data.get('link'))
    elif post_type == 'images':
        images = get_post_images(request_data)
        return ('images', images)

def set_post_content(post, content):
    if (content[0] == 'text'):
        post.text = content[1]
    elif (content[0] == 'link'):
        post.link = content[1]
    elif (content[0] == 'images'):
        post.save()
        for image in content[1]:
            post.images.create(image=image)


def get_title(soup):
        og_title = soup.find('meta', attrs={'property': 'og:title'})
        if og_title and og_title['content']:
            return og_title['content']
        
        twitter_title = soup.find('meta', attrs={'name': 'twitter:title'})
        if twitter_title and twitter_title['content']:
            return twitter_title['content']

        if soup.title and soup.title.string:
            return soup.title.string
        
        if soup.h1 and soup.h1.string:
            return soup.h1.string
        
        if soup.h2 and soup.h2.string:
            return soup.h2.string

        return None

def get_description(soup):
    og_description = soup.find('meta', attrs={'property': 'og:description'})
    if og_description and len(og_description['content']):
        return og_description['content']
    
    twitter_description = soup.find('meta', attrs={'name': 'twitter:description'})
    if twitter_description and len(twitter_description['content']):
        return twitter_description['content']

    meta_description = soup.find('meta', attrs={'name': 'description'})
    if meta_description and len(meta_description['content']):
        return meta_description['content']

    if soup.p and soup.p.string:
        return soup.p.string
    
    return None

def get_image_url(soup):
    og_img = soup.find('meta', attrs={'property': 'og:image'})
    if og_img and og_img['content']:
        return og_img['content']
    
    twitter_img = soup.find('meta', attrs={'name': 'twitter:image'})
    if twitter_img and twitter_img['content']:
        return twitter_img['content']

    img_rel_link = soup.find('link', attrs={'rel': 'image_src'})
    if img_rel_link and img_rel_link['href']:
        return img_rel_link['href']
    
    return None