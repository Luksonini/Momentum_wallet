from django import forms
import datetime
from .models import MarketAnalysisPreferences

class CustomDateInput(forms.DateInput):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        max_date = datetime.date.today() - datetime.timedelta(days=365)
        self.attrs['max'] = max_date.isoformat()

class StrategyInputForm(forms.Form):
    start_date = forms.DateField(widget=CustomDateInput(attrs={'type': 'date', 'id' : 'start-date-input', 'name': 'start_date', 'class' : 'text-center'}))
    window = forms.IntegerField(
        label='Okno',
        min_value=1, max_value=15,
        widget=forms.NumberInput(attrs={'id': 'start-window-input', 'name': 'start-window', 'class' : 'text-center'})
    )
    nlargest_window = forms.IntegerField(
        label='Największe okno',
        min_value=5, max_value=10, 
        widget=forms.NumberInput(attrs={'id': 'start-nlargest-window-input', 'name': 'start-nlargest_window', 'class' : 'text-center'})
    )

class OptimisationPreferencesForm(forms.ModelForm):
    optimisation_date = forms.DateField(
        label='Data optymalizacji',
        widget=CustomDateInput(attrs={'type': 'date', 'id': 'optimisation-date-input', 'name': 'optimisation_date'})
    )
    window = forms.IntegerField(
        label='Okno',
        min_value=1, max_value=15, initial=8,
        widget=forms.NumberInput(attrs={'id': 'optimisation-window-input', 'name': 'window', 'class' : 'text-center'})
    )
    nlargest_window = forms.IntegerField(
        label='Największe okno',
        min_value=5, max_value=10, initial=10,
        widget=forms.NumberInput(attrs={'id': 'optimisation-nlargest-window-input', 'name': 'nlargest_window', 'class' : 'text-center'})
    )

    class Meta:
        model = MarketAnalysisPreferences
        fields = ['optimisation_date', 'window', 'nlargest_window']
