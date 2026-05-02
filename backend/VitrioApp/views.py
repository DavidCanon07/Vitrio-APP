from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Cliente, Usuario, Credencial, Proyecto, Plantilla, Archivo, Dispositivo
from .serializers import ClienteSerializer, UsuarioSerializer, CredencialSerializer, ProyectoSerializer, PlantillaSerializer, ArchivoSerializer,DispositivoSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

   
class CredencialViewSet(viewsets.ModelViewSet):
    queryset = Credencial.objects.all()
    serializer_class = CredencialSerializer
    permission_classes = [IsAuthenticated]
   
class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer
    permission_classes = [IsAuthenticated]   
   
class PlantillaViewSet(viewsets.ModelViewSet):
    queryset = Plantilla.objects.all()
    serializer_class = PlantillaSerializer
    permission_classes = [IsAuthenticated]  

class ArchivoViewSet(viewsets.ModelViewSet):
    queryset = Archivo.objects.all()
    serializer_class = ArchivoSerializer
    permission_classes = [IsAuthenticated]
   
class DispositivoViewSet(viewsets.ModelViewSet):
    queryset = Dispositivo.objects.all()
    serializer_class = DispositivoSerializer
    permission_classes = [IsAuthenticated]      