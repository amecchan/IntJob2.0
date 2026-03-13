from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile

# It uses ORM - Object Relational Mapping.
# it maps python objects to the corresponding code that needs to be 
# executed to make a change in a database.

# This accepts JSON data for new user's UN and PW

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True) # Ensure email is required

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Using create_user ensures the password is hashed correctly
        user = User.objects.create_user(**validated_data)
        user.is_active = False # Keep user inactive until they verify email
        user.save()
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id_type', 'id_image', 'resume', 'is_id_verified']
        read_only_fields = ['is_id_verified'] # Only admins should change this
