# Generated by Django 3.2.18 on 2023-11-21 17:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_portfolio', '0021_portfolio_watchslit'),
    ]

    operations = [
        migrations.RenameField(
            model_name='portfolio',
            old_name='watchslit',
            new_name='watchlist',
        ),
    ]