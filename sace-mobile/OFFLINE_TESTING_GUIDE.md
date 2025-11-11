# Guia de Teste: Funcionalidade Offline

Este guia explica como testar se os registros estão sendo salvos quando não há conexão com a internet e se são enviados automaticamente quando a conexão é restaurada.

## 📱 Como Acessar a Tela de Debug

1. Abra o app e faça login
2. Vá para a aba **"Perfil"** (última aba no menu inferior)
3. Clique no botão **"Debug Offline"** (botão azul acima do botão "Sair")

## 🧪 Passos para Testar

### Teste 1: Salvar Registro Offline

1. **Preparação:**
   - Abra a tela de Debug Offline (Perfil → Debug Offline)
   - Verifique que o status mostra "Online" (indicador verde)
   - Anote o número de operações na fila (deve ser 0)

2. **Desativar Internet:**
   - No dispositivo físico: Desative Wi-Fi e dados móveis nas configurações
   - No emulador Android: Use o menu de configurações do emulador ou `adb shell svc wifi disable` e `adb shell svc data disable`
   - No simulador iOS: Use o menu Hardware → Network → Network Link Conditioner

3. **Verificar Status Offline:**
   - Volte para a tela de Debug Offline
   - O status deve mostrar "Offline" (indicador vermelho)
   - A fila deve continuar em 0

4. **Criar um Registro:**
   - Navegue para criar um novo registro
   - Preencha todos os campos obrigatórios
   - Submeta o formulário
   - Você deve ver um alerta: "Sem conexão - O registro será criado automaticamente quando a conexão com a internet for restaurada."

5. **Verificar Fila:**
   - Volte para a tela de Debug Offline
   - A fila deve mostrar **1 operação pendente**
   - Você pode clicar em "Ver Detalhes da Fila" para ver mais informações

### Teste 2: Sincronização Automática

1. **Restaurar Conexão:**
   - Reative o Wi-Fi e/ou dados móveis
   - Ou no emulador: `adb shell svc wifi enable` e `adb shell svc data enable`

2. **Verificar Sincronização:**
   - Volte para a tela de Debug Offline
   - O status deve mostrar "Online" (indicador verde)
   - **A fila deve ser processada automaticamente** em alguns segundos
   - O número de operações deve voltar para 0
   - Verifique os logs do console para ver mensagens como:
     - "Network connection restored, processing queued operations..."
     - "Successfully executed queued CREATE_REGISTER"

3. **Verificar no Backend:**
   - Verifique no seu backend/banco de dados que o registro foi criado
   - O registro deve ter todos os dados que você preencheu (exceto arquivos, que não são salvos offline)

### Teste 3: Sincronização Manual

1. **Criar Registro Offline:**
   - Repita os passos do Teste 1 para criar um registro offline

2. **Sincronização Manual:**
   - Com a conexão ainda desativada, vá para a tela de Debug Offline
   - O botão "Sincronizar Manualmente" estará desabilitado (porque está offline)
   - Reative a conexão
   - Clique em "Sincronizar Manualmente"
   - A fila deve ser processada imediatamente

### Teste 4: Múltiplos Registros

1. **Criar Vários Registros Offline:**
   - Desative a internet
   - Crie 3-5 registros diferentes
   - Cada um deve ser adicionado à fila

2. **Verificar Fila:**
   - Na tela de Debug, você deve ver o número correto de operações pendentes
   - Clique em "Ver Detalhes da Fila" para ver todos

3. **Sincronizar:**
   - Reative a internet
   - Todos os registros devem ser sincronizados automaticamente
   - A fila deve voltar para 0

### Teste 5: Atualizar Registro Offline

1. **Editar Registro Offline:**
   - Desative a internet
   - Edite um registro existente
   - Salve as alterações
   - Você deve ver o alerta de "Sem conexão"

2. **Verificar e Sincronizar:**
   - Verifique na tela de Debug que a operação UPDATE_REGISTER foi adicionada à fila
   - Reative a internet
   - A atualização deve ser sincronizada automaticamente

## 🔍 O Que Observar

### ✅ Comportamento Esperado

- ✅ Registros são salvos localmente quando offline
- ✅ Fila mostra o número correto de operações pendentes
- ✅ Sincronização automática quando a conexão é restaurada
- ✅ Alertas informativos para o usuário
- ✅ Logs detalhados no console

### ⚠️ Limitações Conhecidas

- **Arquivos/Fotos:** Arquivos não são salvos quando offline. Apenas os metadados do formulário são salvos. Quando sincronizado, o registro será criado sem os arquivos.
- **Retries:** Se uma operação falhar 3 vezes, ela será removida da fila. Verifique os logs para entender por que falhou.

## 🛠️ Comandos Úteis para Teste

### Android Emulator

```bash
# Desativar Wi-Fi
adb shell svc wifi disable

# Desativar dados móveis
adb shell svc data disable

# Reativar Wi-Fi
adb shell svc wifi enable

# Reativar dados móveis
adb shell svc data enable

# Verificar status de rede
adb shell dumpsys connectivity
```

### iOS Simulator

- Use o menu: **Hardware → Network → Network Link Conditioner**
- Ou use o menu: **Device → Network Link Conditioner**

## 📊 Monitoramento

### Logs do Console

Procure por estas mensagens no console:

- `Device is offline, queueing CREATE_REGISTER operation...`
- `Operation queued: [operationId] CREATE_REGISTER`
- `Network connection restored, processing queued operations...`
- `Processing X queued operations...`
- `Successfully executed queued CREATE_REGISTER`
- `Operation removed from queue: [operationId]`

### Tela de Debug

A tela de Debug mostra:
- Status da conexão em tempo real
- Número de operações na fila
- Lista das últimas 5 operações
- Botões para ações manuais

## 🐛 Troubleshooting

### A fila não está sendo processada automaticamente

1. Verifique se a conexão está realmente ativa (status verde na tela de Debug)
2. Verifique os logs do console para erros
3. Tente usar "Sincronizar Manualmente"
4. Verifique se há erros de autenticação (token expirado)

### Operações estão falhando

1. Verifique os logs do console para ver o erro específico
2. Verifique se o token de autenticação ainda é válido
3. Verifique se o backend está acessível
4. Operações que falham 3 vezes são removidas da fila

### Limpar a Fila

Se necessário, você pode limpar toda a fila usando o botão "Limpar Fila" na tela de Debug. **Atenção:** Isso removerá permanentemente todas as operações pendentes.

## 📝 Notas Adicionais

- A sincronização automática acontece quando a conexão é restaurada
- O sistema tenta sincronizar automaticamente quando o app é aberto (se houver conexão)
- Cada operação tem até 3 tentativas antes de ser removida
- A fila é persistida no AsyncStorage, então sobrevive a reinicializações do app

