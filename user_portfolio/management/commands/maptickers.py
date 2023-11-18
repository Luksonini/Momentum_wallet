from django.core.management.base import BaseCommand
from user_portfolio.models import MappedTickers
import pandas as pd
import requests

class Command(BaseCommand):
    help = 'Updates the MappedTickers model with company names and logos'

    def get_company_logo_and_name(self, ticker):
        api_url = f'https://api.api-ninjas.com/v1/logo?ticker={ticker}'
        response = requests.get(api_url, headers={'X-Api-Key': '+zhgPUvc2xvwDNSZsaZd8A==PrkYMsTwM93rZtrk'})

        if response.status_code == requests.codes.ok:
            data = response.json()
            if data:
                return data[0].get('name'), data[0].get('image')

        # Jeśli nie znaleziono danych w pierwszym API, próbuj z drugim API
        api_url = f'https://api.polygon.io/v3/reference/tickers/{ticker}?apiKey=4bVD25p6Wi6ddaJ1vTkSWySahqvcd9qJ'
        response = requests.get(api_url)
        try:
            data = response.json()
            if data:
                name = data['results'].get('name')
                logo_url = data['results']['branding'].get('logo_url')
                if logo_url:
                    logo_url += '?apiKey=4bVD25p6Wi6ddaJ1vTkSWySahqvcd9qJ'
                return name, logo_url
        except KeyError:
            return None, None

    
    def handle(self, *args, **kwargs):
        us500_table = pd.read_html('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')[0]
        tickers = us500_table['Symbol'].to_list()

        for ticker in tickers:
            name, logo_url = self.get_company_logo_and_name(ticker)
            defaults = {'ticker': ticker}  # Dodaj ticker jako domyślny
            if name:
                defaults['company_name'] = name
            if logo_url:
                defaults['logo_url'] = logo_url

            MappedTickers.objects.update_or_create(
                ticker=ticker,
                defaults=defaults
            )
            if name or logo_url:
                self.stdout.write(self.style.SUCCESS(f'Successfully updated {ticker}'))
            else:
                self.stdout.write(self.style.WARNING(f'No name or logo found for {ticker}. Ticker added.'))