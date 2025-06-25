from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import (
    Utilizador, Equipa, Prova, Etapa, Ciclista, Resultados
)
from .serializer import (
    UtilizadorSerializer, EquipasSerializer, ProvaSerializer, EtapaSerializer, 
    CiclistaSerializer, ResultadoSerializer
)

# --- UTILIZADOR ---
@api_view(['GET'])
def get_utilizadores(request):
    users = Utilizador.objects.all()
    serializedData = UtilizadorSerializer(users, many=True).data
    return Response(serializedData)


@api_view(['POST'])
def create_utilizadores(request):
    serializer = UtilizadorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)  # <-- Isto ajuda a ver qual o campo problemático
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def user_detail(request, pk):
    try:
        utilizador = Utilizador.objects.get(pk=pk)
    except Utilizador.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = UtilizadorSerializer(utilizador)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':  # edição parcial
        serializer = UtilizadorSerializer(utilizador, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   

    elif request.method == 'DELETE':
        utilizador.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        serializer = UtilizadorSerializer(utilizador, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # --- EQUIPA ---
@api_view(['GET'])
def get_equipa(request):
    users = Equipa.objects.all()
    serializedData = EquipasSerializer(users, many=True).data
    return Response(serializedData)

@api_view(['POST'])
def create_equipa(request):
    serializer = EquipasSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)  # <-- Isto ajuda a ver qual o campo problemático
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def equipa_detail(request, pk):
    try:
        equipa = Equipa.objects.get(pk=pk)
    except Equipa.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = EquipasSerializer(equipa)
        return Response(serializer.data)

    if request.method == 'DELETE':
        equipa.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        serializer = EquipasSerializer(equipa, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    #Para alimentar o dropdown na escolha de Gestor de Equipas
@api_view(['GET'])
def gestores_equipas(request):
    gestores = Utilizador.objects.filter(is_active=True, tipo='gestor-equipas')
    serializer = UtilizadorSerializer(gestores, many=True)
    return Response(serializer.data)
    
    # --- PROVA ---
@api_view(['GET', 'POST'])
def get_prova(request):
    users = Prova.objects.all()
    serializedData = ProvaSerializer(users, many=True).data
    return Response(serializedData)

@api_view(['POST'])
def create_prova(request):
    serializer = ProvaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)  # <-- Isto ajuda a ver qual o campo problemático
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def prova_detail(request, pk):
    try:
        prova = Prova.objects.get(pk=pk)
    except Prova.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProvaSerializer(prova)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ProvaSerializer(prova, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        prova.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

        # --- ETAPA ---
@api_view(['GET'])
def get_etapa(request):
    users = Etapa.objects.all()
    serializedData = EtapaSerializer(users, many=True).data
    return Response(serializedData)

@api_view(['POST'])
def create_etapa(request):
    serializer = EtapaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)  # <-- Isto ajuda a ver qual o campo problemático
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def etapa_detail(request, pk):
    try:
        etapa = Etapa.objects.get(pk=pk)
    except Etapa.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = EtapaSerializer(etapa)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        etapa.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        serializer = EtapaSerializer(etapa, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        # --- CICLISTA ---
@api_view(['GET'])
def get_ciclista(request):
    cycler = Ciclista.objects.all()
    serializedData = CiclistaSerializer(cycler, many=True).data
    return Response(serializedData)

@api_view(['POST'])
def create_ciclista(request):
    serializer = CiclistaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)  # <-- Isto ajuda a ver qual o campo problemático
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def ciclista_detail(request, pk):
    try:
        cycler = Ciclista.objects.get(pk=pk)
    except Ciclista.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CiclistaSerializer(cycler)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        cycler.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        serializer = CiclistaSerializer(cycler, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

            # --- RESULTADOS ---
@api_view(['GET'])
def get_resultados(request):
    etapa_id = request.GET.get('etapa')
    if etapa_id:
        resultados = Resultados.objects.filter(etapa_id=etapa_id)
    else:
        resultados = Resultados.objects.all()
    serializer = ResultadoSerializer(resultados, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_resultados(request):
    serializer = ResultadoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)  # <-- Isto ajuda a ver qual o campo problemático
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def resultados_detail(request, pk):
    try:
        results = Resultados.objects.get(pk=pk)
    except Resultados.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ResultadoSerializer(results)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        results.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        serializer = ResultadoSerializer(results, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # --- VIEWS PARA O DASHBOARD - INDICADORES

@api_view(['GET'])
def dashboard_stats(request):
    return Response({
        'ciclistas': Ciclista.objects.count(),
        'equipas': Equipa.objects.count(),
        'provas': Prova.objects.count(),
        'resultados': Resultados.objects.count(),
    })

# listar etapas pertencentes a uma prova
@api_view(['GET'])
def listar_etapas(request):
    prova_id = request.GET.get('prova')
    if prova_id:
        etapas = Etapa.objects.filter(prova_id=prova_id)
    else:
        etapas = Etapa.objects.all()
    serializer = EtapaSerializer(etapas, many=True)
    return Response(serializer.data)

# Listar ciclistas que pertencem a determinada equipa
@api_view(['GET'])
def ciclistas_por_equipa(request):
    equipa_id = request.GET.get('equipa')
    if equipa_id:
        ciclistas = Ciclista.objects.filter(equipa_id=equipa_id)
    else:
        ciclistas = Ciclista.objects.none()  # vazio se não for passado o parâmetro
    serializer = CiclistaSerializer(ciclistas, many=True)
    return Response(serializer.data)