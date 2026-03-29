from rest_framework import serializers
from .models import JobPost

class JobPostSerializer(serializers.ModelSerializer):
    # We make employer read_only because we set it automatically in the View
    employer_name = serializers.ReadOnlyField(source='employer.name')
    applicant_count = serializers.SerializerMethodField()

    class Meta:
        model = JobPost
        fields = [
            'id', 'title', 'location', 'salary_min', 'salary_max', 
            'qualifications', 'description', 'is_active', 
            'created_at', 'employer_name', 'applicant_count'
        ]
        read_only_fields = ['id', 'created_at', 'is_active']

    def get_applicant_count(self, obj):
        # This allows your StatCards and Table to show real numbers later
        # For now, it returns 0 until you build the Applications model
        return 0