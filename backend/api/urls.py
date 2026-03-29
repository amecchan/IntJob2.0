# \backend\api\urls.py
from django.urls import path, include
from .views import CreateUserView, VerifyOTPView, UserProfileView, ResendOTPView, home, PasswordResetRequestView, PasswordResetConfirmView, MyTokenObtainPairView, JobPostViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'jobs', JobPostViewSet, basename='job')

urlpatterns = [
    # General
    path('', include(router.urls)),
    path('status/', home, name='api-status'),

    # Authentication & Onboarding
    path('user/register/', CreateUserView.as_view(), name='register'),

    # Profile & Research Features (ID & Resume)
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),

    #verify OTP
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),

    # resend OTP
    path('resend-otp/', ResendOTPView.as_view(), name='resend_otp'),

    #JWT Token
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    

    # Forgot Password
    path('password-reset-request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]