from django.shortcuts import redirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import RedirectView
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import re

from users.models import CustomUser
from users.serializers import UserSerializer, UserCreateSerializer, LoginSerializer


class ProfileView(LoginRequiredMixin, RedirectView):
    """Rediriger l'utilisateur vers l'interface React après connexion."""
    permanent = False
    
    def get_redirect_url(self, *args, **kwargs):
        # Rediriger vers l'interface frontend (React)
        return "http://localhost:5173/"


def index(request):
    return redirect('account_login')


def validate_password_strength(password):
    """
    Vérifie si le mot de passe respecte les critères de sécurité.
    Retourne un tuple (is_valid, message) où is_valid est un booléen et message une description de l'erreur.
    """
    if len(password) < 8:
        return False, "Le mot de passe doit contenir au moins 8 caractères"
    
    if not re.search(r'[A-Z]', password):
        return False, "Le mot de passe doit contenir au moins une lettre majuscule"
    
    if not re.search(r'[a-z]', password):
        return False, "Le mot de passe doit contenir au moins une lettre minuscule"
    
    if not re.search(r'[0-9]', password):
        return False, "Le mot de passe doit contenir au moins un chiffre"
    
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password):
        return False, "Le mot de passe doit contenir au moins un caractère spécial"
    
    return True, ""


@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFTokenView(APIView):
    """API view that sets a CSRF cookie and returns a 200 OK response.
    This endpoint is specifically for getting a CSRF token for forms."""
    
    def get(self, request):
        return Response({
            'success': True,
            'message': 'CSRF cookie set'
        }, status=status.HTTP_200_OK)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class LoginAPIView(APIView):
    """API view for handling user login requests from the frontend."""
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'error': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            login(request, user)
            user_serializer = UserSerializer(user)
            return Response({
                'success': True,
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'error': 'Identifiants invalides. Veuillez réessayer.'
            }, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class SignupAPIView(APIView):
    """API view for handling user registration requests from the frontend."""
    
    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'error': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        password = serializer.validated_data['password']
        
        # Vérifier la force du mot de passe
        is_valid, error_message = validate_password_strength(password)
        if not is_valid:
            return Response({
                'success': False,
                'error': error_message
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        try:
            user = serializer.save()
            login(request, user)
            user_serializer = UserSerializer(user)
            return Response({
                'success': True,
                'user': user_serializer.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
