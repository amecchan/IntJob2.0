import random
from datetime import timedelta
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import models
from django.conf import settings

class UserOTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='otp')
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        # Set to 10 minutes as per your second version
        now = timezone.now()
        return self.created_at >= now - timedelta(minutes=10) # changed to 60 minutes for testing

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))

    def __str__(self):
        return f"OTP for {self.user.username}"

class UserProfile(models.Model):
    # Related name 'profile' allows you to do: user.profile
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # User Roles to match your React Signup Modal
    USER_ROLES = [
        ('applicant', 'Applicant'),
        ('employer', 'Employer'),
    ]
    role = models.CharField(max_length=10, choices=USER_ROLES, default='applicant')

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
        return f"{self.user.username}'s ({self.role}) Profile"
    

class JobPost(models.Model):
    employer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    qualifications = models.TextField(help_text="List qualifications separated by new lines")
    
    is_active = models.BooleanField(default=True)
    # FIX: Removed the extra "auto_"
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.location}"
    