# \backend\api\urls.py
from django.urls import path
from .views import CreateUserView, VerifyOTPView, UserProfileView, home
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # General
    path('', home, name='home'),

    # Authentication & Onboarding
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('user/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),

    # Profile & Research Features (ID & Resume)
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
]