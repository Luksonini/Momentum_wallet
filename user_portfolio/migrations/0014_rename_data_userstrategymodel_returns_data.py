# Generated by Django 3.2.18 on 2023-11-14 15:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_portfolio', '0013_auto_20231113_1755'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userstrategymodel',
            old_name='data',
            new_name='returns_data',
        ),
    ]
