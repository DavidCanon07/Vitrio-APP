"""
WSGI config for Vitrio project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Configuracion de la aplicación WSGI para el proyecto
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Vitrio.settings')

application = get_wsgi_application()
