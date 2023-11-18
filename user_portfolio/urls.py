
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", views.index, name="index"),
    path("chart-data/", views.chart_data, name="chart_data"),
    path('optimisation-data/', views.optimisation_view, name='optimisation_data'),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('tickers_info/', views.tickers_info),
    path('ticker_detail/<str:ticker>', views.ticker_detail, name='ticker_detail'),
    path('user_portfolio_api/', views.user_portfolio_api, name='ticker_detail')
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)