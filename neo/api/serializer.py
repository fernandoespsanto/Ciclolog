from rest_framework import serializers
from .models import Utilizador, Equipa, Prova, Etapa, Ciclista, Resultados

class UtilizadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilizador
        fields = '__all__'

class EquipasSerializer(serializers.ModelSerializer):
    gestor = UtilizadorSerializer(read_only=True)  # ← mostra detalhes
    gestor_id = serializers.PrimaryKeyRelatedField(
    queryset=Utilizador.objects.all(), source='gestor', write_only=True, required=True
    )
    class Meta:
        model = Equipa
        fields = '__all__'

class ProvaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prova
        fields = '__all__'

class EtapaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etapa
        fields = '__all__'

class CiclistaSerializer(serializers.ModelSerializer):
    equipa_nome = serializers.CharField(source='equipa.nome', read_only=True)
    class Meta:
        model = Ciclista
        fields = '__all__'

class ResultadoSerializer(serializers.ModelSerializer):
    ciclista_nome = serializers.CharField(source='ciclista.nome', read_only=True)
    equipa_nome = serializers.CharField(source='ciclista.equipa.nome', read_only=True)
    class Meta:
        model = Resultados
        fields = '__all__'