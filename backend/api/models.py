import random
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

# Create your models here.

class UserOTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        # The PIN expires after 10 minutes
        return timezone.now() < self.created_at + timedelta(minutes=10)

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # Philippine-specific ID Types
    ID_TYPES = [
        ('PHILSYS', 'PhilSys (National ID)'),
        ('UMID', 'UMID'),
        ('PASSPORT', 'Passport'),
        ('DRIVERS', 'Drivers License'),
        ('VOTERS', 'Voters ID'),
    ]
    
    id_type = models.CharField(max_length=20, choices=ID_TYPES, blank=True)
    id_image = models.ImageField(upload_to='identity_docs/', blank=True, null=True)
    is_id_verified = models.BooleanField(default=False)
    
    # Resume storage
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)

import random
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

class UserOTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        # The PIN expires after 10 minutes
        return timezone.now() < self.created_at + timedelta(minutes=10)

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Philippine-specific ID Types
    ID_TYPES = [
        ('PHILSYS', 'PhilSys (National ID)'),
        ('UMID', 'UMID'),
        ('PASSPORT', 'Passport'),
        ('DRIVERS', 'Drivers License'),
        ('VOTERS', 'Voters ID'),
    ]
    
    id_type = models.CharField(max_length=20, choices=ID_TYPES, blank=True)
    id_image = models.ImageField(upload_to='identity_docs/', blank=True, null=True)
    is_id_verified = models.BooleanField(default=False)
    
    # Resume storage
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"