from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

class Command(BaseCommand):
    help = 'Deletes unverified users older than 24 hours'

    def handle(self, *args, **kwargs):
        # Calculate the cutoff time (24 hours ago)
        cutoff_time = timezone.now() - timedelta(hours=24)

        # 1. Find users who are NOT active AND joined before the cutoff
        unverified_users = User.objects.filter(
            is_active=False,
            date_joined__lt=cutoff_time
        )

        count = unverified_users.count()

        if count > 0:
            # 2. Delete them (This also deletes their Profile/OTP via CASCADE)
            unverified_users.delete()
            self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} unverified users.'))
        else:
            self.stdout.write(self.style.SUCCESS('No expired unverified users found.'))