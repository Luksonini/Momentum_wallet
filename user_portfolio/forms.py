from django import forms
import datetime
from .models import MarketAnalysisPreferences

class CustomDateInput(forms.DateInput):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        max_date = datetime.date.today() - datetime.timedelta(days=365)
        self.attrs['max'] = max_date.isoformat()

class StrategyInputForm(forms.Form):
    start_date = forms.DateField(widget=CustomDateInput(attrs={'type': 'date', 'id' : 'start-date-input', 'name': 'start_date'}))

class OptimisationPreferencesForm(forms.ModelForm):
    optimisation_date = forms.DateField(widget=CustomDateInput(attrs={'type': 'date', 'id': 'optimisation-date-input', 'name': 'optimisation_date'}))
    window = forms.IntegerField(
        min_value=1, max_value=15, initial=8,
        widget=forms.NumberInput(attrs={'id': 'window-input', 'name': 'window'})
    )
    nlargest_window = forms.IntegerField(
        min_value=5, max_value=10, initial=10,
        widget=forms.NumberInput(attrs={'id': 'nlargest-window-input', 'name': 'nlargest_window'})
    )

    class Meta:
        model = MarketAnalysisPreferences
        fields = ['optimisation_date', 'window', 'nlargest_window']
