# Generated by Django 3.2.18 on 2023-11-15 17:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_portfolio', '0014_rename_data_userstrategymodel_returns_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='userstrategymodel',
            name='balance',
            field=models.IntegerField(null=True),
        ),
    ]