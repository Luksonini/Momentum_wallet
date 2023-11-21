# from rest_framework import serializers
# from .models import Prices

# from .models import Ticker, Prices



# class LatestPriceSerializer(serializers.ModelSerializer):
#     ticker = serializers.SlugRelatedField(
#         read_only=True,
#         slug_field='symbol'
#     )
#     last_close = serializers.SerializerMethodField()

#     class Meta:
#         model = Prices
#         fields = ['ticker', 'date', 'last_close']

#     def get_last_close(self, obj):
#         return obj.close