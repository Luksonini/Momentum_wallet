import django_filters
from django import forms
from .models import MappedTickers

class MappedTickersFilter(django_filters.FilterSet):
    company_name = django_filters.CharFilter(
        lookup_expr='icontains',
        widget=forms.TextInput(attrs={
            'class': 'mt-1 block w-full border-2 border-gray-300 bg-white py-2 px-4 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
        })
    )

    class Meta:
        model = MappedTickers
        fields = ['company_name']