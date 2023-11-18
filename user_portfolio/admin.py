from django.contrib import admin
from .models import *

# Rejestrowanie modeli w panelu admina Django
@admin.register(UserStrategyModel)
class UserStrategyModelAdmin(admin.ModelAdmin):
    list_display = ('user', 'returns_data', 'current_tickers')
    search_fields = ('user__username',)

@admin.register(MarketAnalysisPreferences)
class MarketAnalysisPreferencesAdmin(admin.ModelAdmin):
    list_display = ('user', 'start_date', 'window', 'nlargest_window', 'balance')
    search_fields = ('user__username',)

@admin.register(PortfolioEntry)
class PortfolioEntryAdmin(admin.ModelAdmin):
    list_display = ('ticker_symbol', 'purchase_date', 'purchase_price', 'quantity')
    search_fields = ('user__username',)

class PortfolioEntryInline(admin.TabularInline):
    model = PortfolioEntry
    extra = 1  # Number of extra forms to display

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('user', 'available_cash')
    search_fields = ('user__username',)
    inlines = [PortfolioEntryInline]

@admin.register(MappedTickers)
class MappedTickersAdmin(admin.ModelAdmin):
    list_display = ('ticker', 'company_name', 'logo_url')  
    search_fields = ('ticker', 'company_name') 

