#!/usr/bin/env python
# -*- coding: utf-8 -*- #

from __future__ import unicode_literals

AUTHOR = 'admin'
SITENAME = 'Webcamoid, The ultimate webcam suite!'
BLOGNAME = 'Webcamoid blog'
SITEURL = 'https://webcamoid.github.io'
PATH = 'content'
OUTPUT_PATH = '..'
TIMEZONE = 'Europe/Paris'
DEFAULT_LANG = 'en-us'
CHARSET = 'UTF-8'
DEFAULT_DATE_FORMAT = '%Y/%m/%d'
DEFAULT_CATEGORY = 'news'
THEME = 'themes/webcamoid'
LOCALE = 'C'

# Feed generation is usually not desired when developing
FEED_DOMAIN = SITEURL
FEED_ALL_ATOM = 'feeds/all.atom.xml'
FEED_ALL_RSS = 'feeds/all.rss.xml'
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

DIRECT_TEMPLATES = [
    'index',
    'blog',
    'donations'
]
PAGINATED_TEMPLATES = {
    'index': None,
    'blog': None,
    'donations': None
}
STATIC_PATHS = ['images']

DELETE_OUTPUT_DIRECTORY = False
USE_FOLDER_AS_CATEGORY = False
ARTICLE_URL = 'posts/{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = 'posts/{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'
PAGE_URL = 'pages/{slug}/'
PAGE_SAVE_AS = 'pages/{slug}/index.html'
BLOG_URL = 'blog/{slug}/'
BLOG_SAVE_AS = 'blog/index.html'
AUTHOR_SAVE_AS = ''
CATEGORY_SAVE_AS = ''
TAG_SAVE_AS = ''

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True

# https://staticman.net/docs/
