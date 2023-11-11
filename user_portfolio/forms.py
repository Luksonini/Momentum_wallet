from django import forms
import datetime
from .models import MarketAnalysisPreferences

class CustomDateInput(forms.DateInput):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Ustawienie maksymalnej daty na rok wstecz od obecnej daty
        max_date = datetime.date.today() - datetime.timedelta(days=365)
        self.attrs['max'] = max_date.isoformat()

class StrategyInputForm(forms.Form):
    start_date = forms.DateField(widget=CustomDateInput(attrs={'type': 'date'}))


class OptimisationPreferencesForm(forms.ModelForm):
    start_date = forms.DateField(widget=CustomDateInput(attrs={'type': 'date'}))
    window = forms.IntegerField(min_value=1, max_value=12, initial=8)
    nlargest_window = forms.IntegerField(min_value=1, max_value=10, initial=10)

    class Meta:
        model = MarketAnalysisPreferences
        fields = ['start_date', 'window', 'nlargest_window']