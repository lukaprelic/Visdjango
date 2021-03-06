from django.conf.urls import patterns, url
from vis import views

urlpatterns = patterns('',
    url(r'^index/$', views.index, name='index'),
    url(r'^help/$', views.help, name='help'),
    url(r'^about/$', views.about, name='about'),
    url(r'^vlad/$', views.vladindex, name='vlad'),
    url(r'^test/$', views.test, name='test'),
      # data URLS
    url(r'^data/vlad/$', views.vlad),
    url(r'^data/(?P<country>\w+)ref/$', views.main_ref),
    url(r'^data/(?P<country>\w+)quiz/$', views.main_quiz),
    url(r'^data/quizanswers/$', views.main_quizanswers),
    url(r'^data/(?P<country>\w+)/$', views.main_data),

)