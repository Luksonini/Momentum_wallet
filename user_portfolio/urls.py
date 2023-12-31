
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", views.index, name="index"),
    path("momentum/", views.momentum, name="momentum"),
    path("chart-data/", views.chart_data, name="chart_data"),
    path('optimisation-data/', views.optimisation_view, name='optimisation_data'),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('tickers_info/', views.tickers_info),
    path('portfolio/', views.portfolio, name='portfolio'),
    path('portfolio/<str:ticker>/', views.portfolio, name='portfolio'),
    path('user_portfolio_api/', views.user_portfolio_api, name='ticker_detail'),
    path('ticker_search_suggestions/', views.ticker_suggestions, name='ticker_suggestions'),
    path('searching_ticker_value_api/', views.searching_ticker_value, name='ticker_suggestions'),
    path('manage_watchlist/', views.manage_watchlist, name='manage_watchlist'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)