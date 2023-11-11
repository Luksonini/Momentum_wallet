# Generated by Django 4.2.1 on 2023-11-06 16:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("user_portfolio", "0005_prices_delete_stocksmodel"),
    ]

    operations = [
        migrations.CreateModel(
            name="UpdateTimestamp",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("last_updated", models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
