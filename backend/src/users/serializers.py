from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the CustomUser model.
    
    Provides serialization and deserialization of CustomUser instances,
    for use in the API.
    """
    
    class Meta:
        model = CustomUser
        fields = ['email', 'is_active', 'zip_code']
        read_only_fields = ['is_active', 'email']


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new user.
    
    Handles validation of required fields and ensures passwords match.
    """
    
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'confirm_password', 'zip_code']
    
    def validate(self, data):
        """Validate that passwords match."""
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return data
    
    def create(self, validated_data):
        """Create and return a new user with encrypted password."""
        # Remove confirm_password as it's not needed for creating the user
        validated_data.pop('confirm_password', None)
        return CustomUser.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    """Serializer for user login.
    
    Validates user credentials for login.
    """
    
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile.
    
    Only allows updating specific fields.
    """
    
    class Meta:
        model = CustomUser
        fields = ['zip_code'] 