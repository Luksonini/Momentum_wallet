from django.contrib import admin
from .models import UserStrategyModel, MarketAnalysisPreferences

# Rejestrowanie modeli w panelu admina Django
@admin.register(UserStrategyModel)
class UserStrategyModelAdmin(admin.ModelAdmin):
    list_display = ('user', 'returns_data', 'current_tickers')
    search_fields = ('user__username',)

@admin.register(MarketAnalysisPreferences)
class MarketAnalysisPreferencesAdmin(admin.ModelAdmin):
    list_display = ('user', 'start_date', 'window', 'nlargest_window')
    search_fields = ('user__username',)
