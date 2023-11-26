from django import forms
import datetime
from .models import MarketAnalysisPreferences, PortfolioEntry

class CustomDateInput(forms.DateInput):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        max_date = datetime.date.today() - datetime.timedelta(days=365)
        self.attrs['max'] = max_date.isoformat()

class StrategyInputForm(forms.Form):
    start_date = forms.DateField(widget=CustomDateInput(attrs={'type': 'date', 'id' : 'start-date-input', 'name': 'start_date', 'class' : 'text-center'}))
    
    window = forms.IntegerField(
        label='Window',
        min_value=1, max_value=15, initial=8,
        widget=forms.NumberInput(attrs={'id': 'start-window-input', 'class' : 'text-center'})
    )
    nlargest_window = forms.IntegerField(
        label='Top stocks',
        min_value=5, max_value=10, initial=10,
        widget=forms.NumberInput(attrs={'id': 'start-nlargest-window-input', 'class' : 'text-center'})
    )
    balance = forms.IntegerField(
        label='Capital',
        min_value=1000, max_value=1000000, initial=1000,
        widget=forms.NumberInput(attrs={'id': 'start-calital-input', 'class' : 'text-center'})
    )

class OptimisationPreferencesForm(forms.ModelForm):
    optimisation_date = forms.DateField(
        label='Start Date',
        widget=CustomDateInput(attrs={'type': 'date', 'id': 'optimisation-date-input'})
    )
    window = forms.IntegerField(
        label='Max Window',
        min_value=1, max_value=80, initial=8,
        widget=forms.NumberInput(attrs={'id': 'optimisation-window-input', 'class' : 'text-center'})
    )
    nlargest_window = forms.IntegerField(
        label='Max Top Stocks',
        min_value=5, max_value=10, initial=10,
        widget=forms.NumberInput(attrs={'id': 'optimisation-nlargest-window-input', 'class' : 'text-center'})
    )

    class Meta:
        model = MarketAnalysisPreferences
        fields = ['optimisation_date', 'window', 'nlargest_window']


# class PortfolioEntryForm(forms.ModelForm):
#     class Meta:
#         model = PortfolioEntry
#         fields = ['ticker_symbol', 'purchase_price', 'quantity']
#         widgets = {
#             'ticker_symbol': forms.TextInput(attrs={
#                 'class': 'hidden',   
#             }),
#             'purchase_price': forms.NumberInput(attrs={
#                 'class': 'hidden',
#                 'id' : 'puthase_price'
               
#             }),
#             'quantity': forms.NumberInput(attrs={
#                 'class': 'mt-1 block w-full border-2 border-gray-300 bg-white py-2 px-4 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
#                 'id' : 'quantity'
#             }),
#         }
