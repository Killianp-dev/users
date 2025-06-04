from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

from .serializers import UserSerializer, UserUpdateSerializer


@method_decorator(ensure_csrf_cookie, name='dispatch')
class UserProfileAPIView(APIView):
    """API view for handling user profile requests.
    
    Allows authenticated users to view and update their profile information.
    """
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Return the user's profile information."""
        serializer = UserSerializer(request.user)
        return Response({
            'success': True,
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    
    def patch(self, request):
        """Update the user's profile information."""
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Return the full user data with updated fields
            user_serializer = UserSerializer(request.user)
            return Response({
                'success': True,
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'error': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST) 