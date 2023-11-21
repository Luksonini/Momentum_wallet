
# from rest_framework import serializers
# from .models import PortfolioEntry, MappedTickers, Portfolio


# class PortfolioEntrySerializer(serializers.ModelSerializer):
#     company_name = serializers.SerializerMethodField()
#     logo_url = serializers.SerializerMethodField()

#     class Meta:
#         model = PortfolioEntry
#         fields = ['ticker_symbol', 'purchase_date', 'purchase_price', 'quantity', 'company_name', 'logo_url']

#     def get_company_name(self, obj):
#         try:
#             mapped_ticker = MappedTickers.objects.get(ticker=obj.ticker_symbol)
#             return mapped_ticker.company_name
#         except MappedTickers.DoesNotExist:
#             return None

#     def get_logo_url(self, obj):
#         try:
#             mapped_ticker = MappedTickers.objects.get(ticker=obj.ticker_symbol)
#             return mapped_ticker.logo_url
#         except MappedTickers.DoesNotExist:
#             return None
        

# class PortfolioSerializer(serializers.ModelSerializer):
#     entries = PortfolioEntrySerializer(many=True, read_only=True)

#     class Meta:
#         model = Portfolio
#         fields = ['available_cash', 'entries']