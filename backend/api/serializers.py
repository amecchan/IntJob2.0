from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import JobPost

# It uses ORM - Object Relational Mapping.
# it maps python objects to the corresponding code that needs to be 
# executed to make a change in a database.

# This accepts JSON data for new user's UN and PW

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # This adds the data INSIDE the encrypted JWT token
        profile = getattr(user, 'userprofile', None) or getattr(user, 'profile', None)
        token['role'] = profile.role if profile else 'applicant'
        token['name'] = f"{user.first_name} {user.last_name}".strip() or user.username
        return token

    def validate(self, attrs):
        # This is what React sees in the raw JSON response body
        data = super().validate(attrs)
        
        # self.user is the user object currently logging in
        user = self.user
        profile = getattr(user, 'userprofile', None) or getattr(user, 'profile', None)
        
        # Add extra keys to the JSON response
        data['role'] = profile.role if profile else 'applicant'
        
        # Construct full name: "First Last" or fallback to "Username"
        full_name = f"{user.first_name} {user.last_name}".strip()
        data['full_name'] = full_name if full_name else user.username
            
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Include the fields you're sending from React
        fields = ['username', 'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # 1. Extract the role from the data React sent (default to 'applicant')
        # Since 'role' isn't a field in the User model, we get it from initial_data
        role = self.initial_data.get('role', 'applicant')

        # 2. Create the base User object
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )

        # 3. Update the Profile role
        # Note: This assumes you've set up the Signals I mentioned 
        # so that user.profile already exists!
        if hasattr(user, 'profile'):
            user.profile.role = role
            user.profile.save()
            
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id_type', 'id_image', 'resume', 'is_id_verified']
        read_only_fields = ['is_id_verified'] # Only admins should change this


class JobPostSerializer(serializers.ModelSerializer):
    # These are "Read Only" because Django handles them automatically
    employer_name = serializers.ReadOnlyField(source='employer.username')
    applicant_count = serializers.SerializerMethodField()

    class Meta:
        model = JobPost
        fields = [
            'id', 'title', 'location', 'salary_min', 'salary_max', 
            'qualifications', 'description', 'is_active', 
            'created_at', 'employer_name', 'applicant_count'
        ]
        # These fields cannot be changed by the frontend
        read_only_fields = ['id', 'created_at', 'is_active']

    def get_applicant_count(self, obj):
        # This is a placeholder. Later, you'll count real rows 
        # from an "Applications" table.
        return 0