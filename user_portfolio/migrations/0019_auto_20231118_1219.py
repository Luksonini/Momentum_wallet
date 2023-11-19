# Generated by Django 3.2.18 on 2023-11-18 11:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_portfolio', '0018_portfolio_portfolioentry'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='portfolio',
            name='entries',
        ),
        migrations.RemoveField(
            model_name='portfolioentry',
            name='user',
        ),
        migrations.AddField(
            model_name='portfolioentry',
            name='portfolio',
            field=models.ForeignKey(default=100, on_delete=django.db.models.deletion.CASCADE, related_name='entries', to='user_portfolio.portfolio'),
            preserve_default=False,
        ),
    ]