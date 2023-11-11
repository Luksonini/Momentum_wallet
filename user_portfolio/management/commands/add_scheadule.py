# from django.core.management.base import BaseCommand
# from django_q.models import Schedule

# class Command(BaseCommand):
#     help = 'Add task to schedule'

#     def handle(self, *args, **kwargs):
#         Schedule.objects.get_or_create(
#             func='user_portfolio.tasks.update_stock_data',
#             name='update_stock_data',
#             schedule_type=Schedule.MINUTES,
#             minutes=5,
#         )
#         self.stdout.write(self.style.SUCCESS('Successfully added task to schedule'))