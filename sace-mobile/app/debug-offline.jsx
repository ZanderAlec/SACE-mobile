import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import offlineCache from '@/services/offlineCache';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = '@offline_queue';

export default function DebugOfflineScreen() {
  const [networkState, setNetworkState] = useState(null);
  const [queueStatus, setQueueStatus] = useState({ count: 0, operations: [] });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [simulateOffline, setSimulateOffline] = useState(false);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkState(state);
    });

    // Get initial network state
    NetInfo.fetch().then(state => {
      setNetworkState(state);
    });

    // Load queue status
    loadQueueStatus();

    // Set up interval to refresh queue status every 2 seconds
    const interval = setInterval(loadQueueStatus, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const loadQueueStatus = async () => {
    try {
      const status = await offlineCache.getQueueStatus();
      setQueueStatus(status);
    } catch (error) {
      console.error('Error loading queue status:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadQueueStatus();
    const state = await NetInfo.fetch();
    setNetworkState(state);
    setIsRefreshing(false);
  };

  const handleManualSync = async () => {
    try {
      Alert.alert(
        'Sincronização Manual',
        'Deseja processar a fila de operações agora?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Sincronizar',
            onPress: async () => {
              try {
                await offlineCache.processQueue();
                await loadQueueStatus();
                Alert.alert('Sucesso', 'Fila processada. Verifique os logs para mais detalhes.');
              } catch (error) {
                Alert.alert('Erro', `Erro ao processar fila: ${error.message}`);
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleClearQueue = async () => {
    Alert.alert(
      'Limpar Fila',
      `Tem certeza que deseja limpar todas as ${queueStatus.count} operações da fila? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await offlineCache.clearQueue();
              await loadQueueStatus();
              Alert.alert('Sucesso', 'Fila limpa com sucesso.');
            } catch (error) {
              Alert.alert('Erro', error.message);
            }
          }
        }
      ]
    );
  };

  const handleViewQueueDetails = async () => {
    try {
      const queueJson = await AsyncStorage.getItem(QUEUE_KEY);
      const queue = queueJson ? JSON.parse(queueJson) : [];
      
      if (queue.length === 0) {
        Alert.alert('Fila Vazia', 'Não há operações na fila.');
        return;
      }

      const details = queue.map((op, index) => 
        `${index + 1}. ${op.type} (ID: ${op.id})\n   Timestamp: ${new Date(op.timestamp).toLocaleString()}\n   Tentativas: ${op.retries || 0}`
      ).join('\n\n');

      Alert.alert('Detalhes da Fila', details);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleTestOfflineMode = () => {
    // Note: This is a simulation - the actual offline detection uses NetInfo
    // This is just for UI testing purposes
    setSimulateOffline(!simulateOffline);
    Alert.alert(
      'Modo Offline Simulado',
      simulateOffline 
        ? 'Modo offline desativado. A detecção real de rede ainda está ativa.'
        : 'Modo offline ativado (apenas visual). A detecção real de rede ainda está ativa.'
    );
  };

  const isConnected = networkState?.isConnected && networkState?.isInternetReachable !== false;
  const connectionStatus = simulateOffline ? 'Simulado Offline' : (isConnected ? 'Online' : 'Offline');
  const connectionColor = simulateOffline ? '#FF9500' : (isConnected ? '#34C759' : '#FF3B30');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Debug: Funcionalidade Offline</Text>

      {/* Network Status Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status da Conexão</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusIndicator, { backgroundColor: connectionColor }]} />
          <Text style={styles.statusText}>{connectionStatus}</Text>
        </View>
        {networkState && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>
              Tipo: {networkState.type || 'Desconhecido'}
            </Text>
            <Text style={styles.detailText}>
              Conectado: {networkState.isConnected ? 'Sim' : 'Não'}
            </Text>
            <Text style={styles.detailText}>
              Internet Acessível: {networkState.isInternetReachable !== false ? 'Sim' : 'Não'}
            </Text>
            {networkState.details && (
              <Text style={styles.detailText}>
                SSID: {networkState.details.ssid || 'N/A'}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Queue Status Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status da Fila</Text>
        <View style={styles.statusRow}>
          <Text style={styles.queueCount}>{queueStatus.count}</Text>
          <Text style={styles.queueLabel}>
            {queueStatus.count === 1 ? 'operação pendente' : 'operações pendentes'}
          </Text>
        </View>
        {queueStatus.operations.length > 0 && (
          <View style={styles.operationsList}>
            {queueStatus.operations.slice(0, 5).map((op, index) => (
              <View key={op.id} style={styles.operationItem}>
                <Text style={styles.operationType}>{op.type}</Text>
                <Text style={styles.operationTime}>
                  {new Date(op.timestamp).toLocaleString()}
                </Text>
                {op.retries > 0 && (
                  <Text style={styles.retryCount}>Tentativas: {op.retries}</Text>
                )}
              </View>
            ))}
            {queueStatus.operations.length > 5 && (
              <Text style={styles.moreText}>
                +{queueStatus.operations.length - 5} mais...
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.syncButton]}
          onPress={handleManualSync}
          disabled={!isConnected || queueStatus.count === 0}
        >
          <Text style={styles.buttonText}>Sincronizar Manualmente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.viewButton]}
          onPress={handleViewQueueDetails}
          disabled={queueStatus.count === 0}
        >
          <Text style={styles.buttonText}>Ver Detalhes da Fila</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={handleClearQueue}
          disabled={queueStatus.count === 0}
        >
          <Text style={styles.buttonText}>Limpar Fila</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.testButton]}
          onPress={handleTestOfflineMode}
        >
          <Text style={styles.buttonText}>
            {simulateOffline ? 'Desativar Modo Offline Simulado' : 'Ativar Modo Offline Simulado'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>Como Testar:</Text>
        <Text style={styles.instructionText}>
          1. Desative o Wi-Fi e dados móveis do dispositivo
        </Text>
        <Text style={styles.instructionText}>
          2. Tente criar ou atualizar um registro
        </Text>
        <Text style={styles.instructionText}>
          3. Verifique que a operação foi adicionada à fila
        </Text>
        <Text style={styles.instructionText}>
          4. Reative a conexão com a internet
        </Text>
        <Text style={styles.instructionText}>
          5. A sincronização deve acontecer automaticamente
        </Text>
        <Text style={styles.instructionText}>
          6. Ou use o botão "Sincronizar Manualmente" para forçar
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detailsContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  queueCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 8,
  },
  queueLabel: {
    fontSize: 16,
    color: '#666',
    alignSelf: 'flex-end',
  },
  operationsList: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  operationItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  operationType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  operationTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  retryCount: {
    fontSize: 12,
    color: '#FF9500',
    marginTop: 2,
  },
  moreText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncButton: {
    backgroundColor: '#34C759',
  },
  viewButton: {
    backgroundColor: '#007AFF',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  testButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1976D2',
  },
  instructionText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 8,
    lineHeight: 20,
  },
});

