from django.conf.urls import patterns, url
from vis import views

urlpatterns = patterns('',
    url(r'^index/$', views.index, name='index'),
    url(r'^czech/$', views.index, name='czech'),
    url(r'^UK/$', views.index, name='UK'),
    url(r'^help/$', views.help, name='help'),
    url(r'^about/$', views.about, name='about'),
      # data URLS
    url(r'^data/ukdata/$', views.main_data),
    url(r'^data/(?P<country>\w+)ref/$', views.main_ref),
    url(r'^data/(?P<country>\w+)quiz/$', views.main_quiz),
    url(r'^data/(?P<country>\w+)/$', views.main_data),
)