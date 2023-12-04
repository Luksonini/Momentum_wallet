
from .models import *
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    pass

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
    extra = 1 

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('user', 'available_cash', 'initial_portfolio_value')
    search_fields = ('user__username',)
    inlines = [PortfolioEntryInline]

@admin.register(MappedTickers)
class MappedTickersAdmin(admin.ModelAdmin):
    list_display = ('ticker', 'company_name', 'logo_url')  
    search_fields = ('ticker', 'company_name') 

@admin.register(Watchlist)
class WatchlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'display_tickers')
    search_fields = ('user__username', 'tickers__ticker')

    def display_tickers(self, obj):
        return ", ".join([ticker.ticker for ticker in obj.tickers.all()])
    display_tickers.short_description = 'Observed_tickers'