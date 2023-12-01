from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
import pandas as pd
# from django.core.serializers.json import DjangoJSONEncoder
import datetime


class User(AbstractUser):
    pass

class UserStrategyModel(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    returns_data = models.JSONField(null=True)  # Przechowuje dane jako JSON
    current_tickers = models.JSONField(null=True)
    

class MarketAnalysisPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    start_date = models.DateField(default=datetime.date(2015, 1, 1))
    window = models.IntegerField(default=8)
    nlargest_window = models.IntegerField(default=10)
    balance = models.IntegerField(default=1000)
    # max_nlargest = models.IntegerField(null=True)

    def __str__(self):
        return f"{self.user.username}'s market analysis preferences"

     
class Portfolio(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    available_cash = models.DecimalField(max_digits=10, decimal_places=2)
    initial_portfolio_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.user.username}'s Portfolio"
    

class PortfolioEntry(models.Model):
    portfolio = models.ForeignKey(Portfolio, related_name='entries', on_delete=models.CASCADE)
    ticker_symbol = models.CharField(max_length=10)
    purchase_date = models.DateField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.portfolio.user.username} - {self.ticker_symbol} {self.quantity}@{self.purchase_price} on {self.purchase_date}"
    
class MappedTickers(models.Model):
    ticker = models.CharField(max_length=10, unique=True)
    company_name = models.CharField(max_length=255, null=True, blank=True)
    logo_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"{self.ticker} - {self.company_name}"

class Watchlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='watchlists')
    tickers = models.ManyToManyField(MappedTickers, related_name='watchlists')

    def __str__(self):
        return f"{self.user.username}'s Watchlist"   
    


