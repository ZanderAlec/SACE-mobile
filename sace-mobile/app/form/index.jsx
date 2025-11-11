import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalSearchParams, router } from 'expo-router'

import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

import Divider from '@/components/general/Divider'

import StepIndicator from '../form/stepIndicator'
import Endereco from '../form/endereco'
import SelecaoFormulario from '../form/selecaoFormulario'
import Levantamento from '../form/levantamento'
import ColetaAmostras from '../form/coletaAmostras'
import Tratamentos from '../form/tratamentos'
import Observacoes from '../form/Observacoes'
import Upload from '../form/Upload'

import { registersApi } from '@/services/api'



function FieldRegisterForm() {
  const { logout } = useAuth();
  const {
    mode = 'edit',
    area,
    register,
  } = useLocalSearchParams();

  const [currStep, setCurrStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [parsedArea, setParsedArea] = useState(null);
  const [parsedRegister, setParsedRegister] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if(mode === 'edit') {
      setIsEditing(true);
    }

    if(mode == "view"){
      setIsEditing(false);
    }

    // Parse the area parameter from route params
    if (area) {
      try {
        const parsed = typeof area === 'string' ? JSON.parse(area) : area;
        setParsedArea(parsed);
      } catch (error) {
        console.error('Error parsing area parameter:', error);
      }
    }
    
    // Parse the register parameter from route params
    if (register) {
      try {
        const parsed = typeof register === 'string' ? JSON.parse(register) : register;
        setParsedRegister(parsed);
      } catch (error) {
        console.error('Error parsing register parameter:', error);
      }
    }
   
  }, [register, area, mode]);


  const handleBack = () => {
    router.back();
  };
  
  const TOTAL_STEPS = 6;

  const nextStep = () => {
    if (currStep + 1 < TOTAL_STEPS)
      setCurrStep(currStep+1);
  }

  const prevStep = () => {
    if (currStep - 1 >= 0)
      setCurrStep(currStep-1);
  }

  const handleEdit = () => {
    setIsEditing(!isEditing);
  }

  const onSubmit = async (uploadData) => {
    // Check if we're editing an existing register
    const registroId = parsedRegister?.registro_de_campo_id || parsedRegister?.id;
    const isUpdating = isEditing && registroId;
    
    try {
      setIsSubmitting(true);
      
      // Get area_de_visita_id from area or register
      const area_de_visita_id = parsedArea?.area_de_visita_id || parsedRegister?.area_de_visita_id;
      
      if (!area_de_visita_id) {
        Alert.alert('Erro', 'Área de visita não encontrada');
        setIsSubmitting(false);
        return;
      }

      // Get formulario_tipo from register if editing
      const formulario_tipo = parsedRegister?.formulario_tipo || null;

      // Map formData to API format
      const endereco = formData.endereco || {};
      const levantamento = formData.levantamento || {};
      const coletaAmostras = formData.coletaAmostras || {};
      const tratamentos = formData.tratamentos || {};
      const observacoes = formData.observacoes || {};
      
      const atividadesRealizadas = levantamento.atividadesRealizadas || {};
      const quantDepositos = levantamento.quantDepositos || {};
      
      // Prepare larvicidas and adulticidas as JSON strings
      const larvicidasArray = [];
      if (tratamentos.larvicida && tratamentos.larvicida.tipo) {
        larvicidasArray.push({
          tipo: tratamentos.larvicida.tipo,
          forma: tratamentos.larvicida.forma || '',
          quantidade: tratamentos.larvicida.quantidade || 0
        });
      }
      
      const adulticidasArray = [];
      if (tratamentos.adulticida && tratamentos.adulticida.tipo) {
        adulticidasArray.push({
          tipo: tratamentos.adulticida.tipo,
          forma: tratamentos.adulticida.forma || '',
          quantidade: tratamentos.adulticida.quantidade || 0
        });
      }
      
      // Prepare files array
      const files = [];
      if (uploadData?.foto && uploadData.foto.uri) {
        files.push(uploadData.foto);
      }
      
      // Build request body
      // Use the actual status value from the form - don't use defaults
      const imovel_status = endereco.status || null;
      
    
      
      const requestBody = {
        imovel_numero: endereco.numeroImovel || '',
        imovel_lado: endereco.lado || '',
        imovel_categoria_da_localidade: endereco.categoriaLocalidade || '',
        imovel_tipo: endereco.tipoImovel || '',
        imovel_status: imovel_status, // Use actual form value, no default
        imovel_complemento: endereco.complemento || null,
        formulario_tipo: formulario_tipo || null,
        li: atividadesRealizadas.levantamentoIndice === true,
        pe: atividadesRealizadas.pontoEstrategico === true,
        t: atividadesRealizadas.tratamento === true,
        df: atividadesRealizadas.delimitacaoFoco === true,
        pve: atividadesRealizadas.pesquisaVetorial === true,
        numero_da_amostra: coletaAmostras.numeroAmostras || null,
        quantiade_tubitos: coletaAmostras.quantTubitos ? parseInt(coletaAmostras.quantTubitos, 10) : null,
        observacao: observacoes.observacoes || null,
        area_de_visita_id: parseInt(area_de_visita_id, 10),
        a1: parseInt(quantDepositos.armazenamentoElevado || 0, 10),
        a2: parseInt(quantDepositos.armazenamentoAguaSolo || 0, 10),
        b: parseInt(quantDepositos.dispositivosMoveis || 0, 10),
        c: parseInt(quantDepositos.dispositivosFixos || 0, 10),
        d1: parseInt(quantDepositos.pneus || 0, 10),
        d2: parseInt(quantDepositos.lixos || 0, 10),
        e: parseInt(quantDepositos.naturais || 0, 10),
        larvicidas: larvicidasArray.length > 0 ? JSON.stringify(larvicidasArray) : null,
        adulticidas: adulticidasArray.length > 0 ? JSON.stringify(adulticidasArray) : null,
        files: files
      };
      
      
      // Validate required fields
      if (!requestBody.imovel_numero || !requestBody.imovel_lado || !requestBody.imovel_categoria_da_localidade || 
          !requestBody.imovel_tipo || !requestBody.imovel_status || !requestBody.area_de_visita_id) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios, incluindo o Status do imóvel');
        setIsSubmitting(false);
        return;
      }
      
      let response;
      if (isUpdating) {
        // Update existing register using PUT
        response = await registersApi.updateRegister(registroId, requestBody);
        Alert.alert('Sucesso', 'Registro atualizado com sucesso!', [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]);
      } else {
        // Create new register using POST
        response = await registersApi.createRegister(requestBody);
        Alert.alert('Sucesso', 'Registro criado com sucesso!', [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]);
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Handle offline queued operations
      if (error.message === 'OFFLINE_QUEUED') {
        const action = isUpdating ? 'atualizado' : 'criado';
        Alert.alert(
          'Sem conexão',
          `O registro será ${action} automaticamente quando a conexão com a internet for restaurada.`,
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
        return;
      }
      
      const action = isUpdating ? 'atualizar' : 'criar';
      const errorMessage = error.response?.data?.message || error.message || `Erro ao ${action} registro`;
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  const saveFormData = (stepData, stepName) => {
    setFormData(prev => ({
      ...prev,
      [stepName]: stepData
    }));
  }

  const formHandler = {
    nextStep,
    prevStep,
    formData,
    saveFormData,
    onSubmit,
    isSubmitting
  }

  const formPages = [
    <Endereco formHandler={formHandler} register={parsedRegister} area={parsedArea} isEditing={isEditing} />,
    <Levantamento formHandler={formHandler} register={parsedRegister} isEditing={isEditing}/>,
    <ColetaAmostras formHandler={formHandler} register={parsedRegister} isEditing={isEditing}/>,
    <Tratamentos formHandler={formHandler} register={parsedRegister} isEditing={isEditing}/>,
    <Observacoes formHandler={formHandler} register={parsedRegister} isEditing={isEditing}/>,
    <Upload formHandler={formHandler} register={parsedRegister} isEditing={isEditing}/>
  ]

  const stepsTextList = [
    "Endere. do imóvel", 
    "Lev. Informações", 
    "Coleta de amostras", 
    "Tratam. Aplicados", 
    "Observações", 
    "Upload de arquivos"
  ]

  return (
    <ScrollView 
      contentContainerStyle={{ padding: 16, backgroundColor: 'white' }}
      keyboardShouldPersistTaps="handled"
    >
    <View >
      {/* Back arrow on the right */}
      <View style={styles.headerContainer}>
        <Pressable style={styles.backArrowButton} onPress={handleBack}>
          <AntDesign name="close" size={24} color="black" />
        </Pressable>
      </View>
      
      <View style = {styles.indicatorContainer}>
        <StepIndicator stepsNum={TOTAL_STEPS - 1}  currStep={currStep} stepsTextList={stepsTextList}/>
      </View>

       <View style ={[styles.container, styles.bkgWhite]}>
        {formPages[currStep]}
      </View>

      <Divider/>

      <View style = {[styles.flexRow, currStep !== 0 && {justifyContent: 'space-between'}]}>

      </View>
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    borderBlockColor: 'red',
    padding: 10,
  },


  bkgGray:{
    backgroundColor: 'lightgray',
  },

  bkgWhite:{
    backgroundColor: 'white'
  },

  indicatorContainer:{
    flexDirection: 'row',
    alignItems: 'center',
  }, 

  line:{
    width: 20,
    height: 2,
    backgroundColor: 'black',
    margin: 3,
  },

  activeLine:{
    width: 20,
    height: 2,
    backgroundColor: 'blue',
    margin: 3,
  },
  
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    boxSizing: 'border-box',
    gap: 16,
  },

  bttm: {
    paddingBlock: 16,
    flexGrow: 1,
    maxWidth: 140,
    alignItems: 'center',
    borderRadius: 6,
  },

  bttmNext: {
    backgroundColor: '#2AD947',
  },

  bttmPrev: {
    backgroundColor: "#3B67CE",
  },

  bttmDisabled: {
    
  },

  bttmText: {
    color: 'white',
    fontSize: 16,
  },

  logoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B67CE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },

  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },

  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },

  editDeleteContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },

  backArrowButton: {
    padding: 8,
  }
  
});

export default FieldRegisterForm