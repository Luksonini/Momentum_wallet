# hello.py
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Prints hello world"

    def handle(self, *args, **kwargs):
        print("Hello, world!")