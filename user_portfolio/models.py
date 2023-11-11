from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
import pandas as pd
from django.core.serializers.json import DjangoJSONEncoder
import datetime

class User(AbstractUser):
    pass


class UserStrategyModel(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    data = models.JSONField(encoder=DjangoJSONEncoder, null=True)  # Przechowuje dane jako JSON

class MarketAnalysisPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    start_date = models.DateField(default=datetime.date(2015, 1, 1))
    window = models.IntegerField(default=8)
    nlargest_window = models.IntegerField(default=10)
    # Możesz dodać więcej pól w zależności od parametrów używanych przez MarketAnalysis

    def __str__(self):
        return f"{self.user.username}'s market analysis preferences"

