import random
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import generics, status, views, viewsets, permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from django.contrib.auth.hashers import make_password
from django.db.models import Q

# Local imports
from .models import UserOTP, UserProfile, JobPost
from .serializers import UserSerializer, JobPostSerializer # Ensure your serializer handles 'role'

# 1. Registration with Role & OTP
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # 1. Create the User (Inactive by default)
            user = serializer.save()
            user.is_active = False 
            user.save()

            # 2. Set the Role in the Profile
            # We use get_or_create to ensure no duplicate profile errors
            role = request.data.get('role', 'applicant')
            profile, created = UserProfile.objects.get_or_create(user=user)
            profile.role = role
            profile.save()

            # 3. Generate and Save OTP
            otp_code = UserOTP.generate_otp()
            UserOTP.objects.update_or_create(
                user=user, 
                defaults={'otp_code': otp_code, 'created_at': timezone.now()}
            )

            # 4. Send the OTP via Email
            try:
                send_mail(
                    subject="Your IntJob Verification Code",
                    message=f"Welcome to IntJob! \n\nYour 6-digit verification code is: {otp_code}. \n\nIt expires in 10 minutes.",
                    from_email="IntJob Support <noreply@intjob.app>",
                    recipient_list=[user.email],
                    fail_silently=True,
                )
            except Exception as e:
                # Log the error but don't crash the request
                print(f"Email error: {e}")

            return Response({
                "message": "User created! Check your email for the verification code.",
                "email": user.email
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 2. OTP Verification
class VerifyOTPView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        otp_entered = request.data.get('otp')

        # 1. Find the user
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # 2. Check the OTP
        otp_record = UserOTP.objects.filter(
                        user=user, 
                        otp_code=otp_entered
                    ).order_by('-created_at').first()

        if otp_record and otp_record.is_valid():
            # SUCCESS: This is where the "Saving" happens
            user.is_active = True  # Now they can log in
            user.save()
            
            # Clean up the OTP so it can't be used again
            otp_record.delete() 

            return Response({
                "message": "Account verified! You can now log in."
            }, status=status.HTTP_200_OK)
        
        return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

# 3. Profile Management
class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    # Note: You will need a UserProfileSerializer for this to work fully
    # serializer_class = UserProfileSerializer 

    def get_object(self):
        return self.request.user.profile

# 4. Simple Home View
def home(request):
    return HttpResponse("Welcome to the IntJob API!")


# 5. Resend OTP
class ResendOTPView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            
            if user.is_active:
                return Response({"message": "This account is already verified."}, status=status.HTTP_400_BAD_REQUEST)

            # Generate new OTP
            otp_code = UserOTP.generate_otp()
            UserOTP.objects.update_or_create(
                user=user, 
                defaults={'otp_code': otp_code, 'created_at': timezone.now()}
            )

            # Send the new code to terminal/email
            send_mail(
                subject="Your New IntJob Verification Code",
                message=f"Your new 6-digit code is: {otp_code}. \n\nIt expires in 10 minutes.",
                from_email="IntJob Support <noreply@intjob.app>",
                recipient_list=[user.email],
            )

            return Response({"message": "New OTP sent! Check your email."}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# Forgot Password
class PasswordResetRequestView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip() # Clean the input
        
        # Search BOTH email and username fields (case-insensitive)
        user = User.objects.filter(Q(email__iexact=email) | Q(username__iexact=email)).first()
        
        if user:
            # Generate and save OTP
            otp_code = UserOTP.generate_otp()
            UserOTP.objects.update_or_create(
                user=user, 
                defaults={'otp_code': otp_code, 'created_at': timezone.now()}
            )
            
            # Send the mail
            send_mail(
                subject="IntJob Password Reset Code",
                message=f"Your password reset code is: {otp_code}",
                from_email="noreply@intjob.app",
                recipient_list=[user.email],
            )
            return Response({"message": "Reset code sent!"}, status=status.HTTP_200_OK)
        
        # If no user found
        return Response({"error": "No account found with this email."}, status=status.HTTP_404_NOT_FOUND)

class PasswordResetConfirmView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp_entered = request.data.get('otp')
        new_password = request.data.get('new_password')

        otp_record = UserOTP.objects.filter(user__email=email, otp_code=otp_entered).first()

        if otp_record and otp_record.is_valid():
            user = otp_record.user
            user.password = make_password(new_password)
            user.save()
            otp_record.delete()
            return Response({"message": "Password updated successfully!"}, status=status.HTTP_200_OK)
        
        return Response({"error": "Invalid or expired code."}, status=status.HTTP_400_BAD_REQUEST)
    

class JobPostViewSet(viewsets.ModelViewSet):
    # This must match your model and serializer names
    queryset = JobPost.objects.all()
    serializer_class = JobPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtering so employers only see their own posts
        return self.queryset.filter(employer=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the employer
        serializer.save(employer=self.request.user)