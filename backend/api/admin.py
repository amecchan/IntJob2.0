from django.contrib import admin
from .models import UserProfile, UserOTP


# Register your models here.

# Register your models here so they show up in the Admin UI
class UserProfileAdmin(admin.ModelAdmin):
    # This creates columns in the list view
    list_display = ('user', 'role', 'get_email', 'get_date_joined')
    # This adds a sidebar filter for easy sorting
    list_filter = ('role',)
    # This adds a search bar for usernames or emails
    search_fields = ('user__username', 'user__email')

    # Helper methods to pull data from the linked User model
    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'

    def get_date_joined(self, obj):
        return obj.user.date_joined
    get_date_joined.short_description = 'Joined Date'

class UserOTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'otp_code', 'created_at', 'is_valid_status')
    
    def is_valid_status(self, obj):
        return obj.is_valid()
    is_valid_status.boolean = True # Shows a green check or red X
    is_valid_status.short_description = 'Currently Valid'

# Register the models with their new custom classes
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(UserOTP, UserOTPAdmin)