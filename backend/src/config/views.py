from django.shortcuts import redirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
import re

from users.models import CustomUser


class ProfileView(LoginRequiredMixin, TemplateView):
    template_name = 'account/profile.html'


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
class LoginAPIView(APIView):
    """API view for handling user login requests from the frontend."""
    
    def post(self, request):
        data = json.loads(request.body)
        email = data.get('email', '')
        password = data.get('password', '')
        
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            login(request, user)
            return Response({
                'success': True,
                'email': user.email,
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
        data = json.loads(request.body)
        email = data.get('email', '')
        password = data.get('password', '')
        confirm_password = data.get('confirmPassword', '')
        
        if not email or not password:
            return Response({
                'success': False,
                'error': 'Email et mot de passe requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier si les mots de passe correspondent
        if 'confirmPassword' in data and password != confirm_password:
            return Response({
                'success': False,
                'error': 'Les mots de passe ne correspondent pas'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier la force du mot de passe
        is_valid, error_message = validate_password_strength(password)
        if not is_valid:
            return Response({
                'success': False,
                'error': error_message
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already exists
        if CustomUser.objects.filter(email=email).exists():
            return Response({
                'success': False,
                'error': 'Un utilisateur avec cet email existe déjà'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        try:
            user = CustomUser.objects.create_user(email=email, password=password)
            login(request, user)
            return Response({
                'success': True,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
