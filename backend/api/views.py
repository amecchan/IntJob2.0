from django.contrib.auth.models import User
from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.http import HttpResponse
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone

# Local imports
from .models import UserOTP, UserProfile
from .serializers import UserSerializer

# Create your views here.

# 1. Registration (CREATE)
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False # Keep inactive until OTP verified
            user.save()

            # Create the Profile and OTP
            UserProfile.objects.get_or_create(user=user)
            otp_code = UserOTP.generate_otp()
            UserOTP.objects.update_or_create(
                user=user, 
                defaults={'otp_code': otp_code, 'created_at': timezone.now()}
            )

            # Send the PIN
            send_mail(
                subject="Your IntJob Verification Code",
                message=f"Your 6-digit code is: {otp_code}. \n\n\nIt expires in 10 minutes.",
                #from_email=settings.EMAIL_HOST_USER,
                from_email="IntJob Support <noreply@intjob.app>", #Show as 'IntJob Support' 
                recipient_list=[user.email],
            )

            return Response({"message": "User created! Check your email for the PIN."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 2. OTP Verification (UPDATE user status)
class VerifyOTPView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"message": "This endpoint expects a POST request with email and otp."})

    def post(self, request, *args, **kwargs):
        print(f"DEBUG: request.data is {request.data}")
        print(f"DEBUG: args/kwargs are {args}, {kwargs}")
        
        email = request.data.get('email')
        otp_entered = request.data.get('otp')

        try:
            user = User.objects.get(email=email)
            otp_record = UserOTP.objects.get(user=user)

            if otp_record.otp_code == otp_entered and otp_record.is_valid():
                user.is_active = True
                user.save()
                otp_record.delete() 
                return Response({"message": "Account verified!"}, status=status.HTTP_200_OK)
            return Response({"error": "Invalid or expired PIN."}, status=status.HTTP_400_BAD_REQUEST)
        except (User.DoesNotExist, UserOTP.DoesNotExist):
            return Response({"error": "Data not found."}, status=status.HTTP_404_NOT_FOUND)

# 3. Profile Management (READ & UPDATE)
class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    # serializer_class = UserProfileSerializer # You need to define this in serializers.py!

    def get_object(self):
        return self.request.user.profile

def home(request):
    return HttpResponse("Welcome to the IntJob API!")