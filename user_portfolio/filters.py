import django_filters
from django import forms
from .models import MappedTickers

class MappedTickersFilter(django_filters.FilterSet):
    company_name = django_filters.CharFilter(
        lookup_expr='icontains',
        widget=forms.TextInput(attrs={
            'class': 'text-3xl mt-1 block w-full border-2 border-gray-300 bg-white px-4 shadow-sm focus:outline-none focus:ring focus:border-blue-500',
        })
    )

    class Meta:
        model = MappedTickers
        fields = ['company_name']