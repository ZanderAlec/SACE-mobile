import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert, Pressable } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, router } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';

import { denunciaSchema } from '@/schemas/denunciaForm/schema'
import FormTextInput from '@/components/forms/FormTextInput'
import FormPickerInput from '@/components/forms/FormPickerInput'
import Title from '@/components/text/Title'
import UiButton from '@/components/general/UiButton'
import { denunciasApi } from '@/services/api'

function DenunciaForm() {
  const { denuncia: denunciaParam } = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [parsedDenuncia, setParsedDenuncia] = React.useState(null);

  useEffect(() => {
    if (denunciaParam) {
      try {
        const parsed = typeof denunciaParam === 'string' ? JSON.parse(denunciaParam) : denunciaParam;
        setParsedDenuncia(parsed);
      } catch (error) {
        console.error('Error parsing denuncia parameter:', error);
      }
    }
  }, [denunciaParam]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    resolver: zodResolver(denunciaSchema),
    defaultValues: {
      rua_avenida: '',
      numero: '',
      bairro: '',
      tipo_imovel: '',
      endereco_complemento: '',
      data_denuncia: '',
      hora_denuncia: '',
      observacoes: '',
      status: '',
      agente_responsavel_id: undefined,
    },
  });

  useEffect(() => {
    if (parsedDenuncia) {
      const numeroValue = parsedDenuncia.numero !== undefined && parsedDenuncia.numero !== null 
        ? String(parsedDenuncia.numero) 
        : '';
      
      reset({
        rua_avenida: parsedDenuncia.rua_avenida || '',
        numero: numeroValue,
        bairro: parsedDenuncia.bairro || '',
        tipo_imovel: parsedDenuncia.tipo_imovel || '',
        endereco_complemento: parsedDenuncia.endereco_complemento || '',
        data_denuncia: parsedDenuncia.data_denuncia || '',
        hora_denuncia: parsedDenuncia.hora_denuncia || '',
        observacoes: parsedDenuncia.observacoes || '',
        status: parsedDenuncia.status || '',
        agente_responsavel_id: parsedDenuncia.agente_responsavel_id || undefined,
      });
      
    }
  }, [parsedDenuncia, reset]);

  const handleBack = () => {
    router.back();
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      const denunciaId = parsedDenuncia?.id || parsedDenuncia?.denuncia_id;
      
      if (!denunciaId) {
        Alert.alert('Erro', 'ID da denúncia não encontrado');
        setIsSubmitting(false);
        return;
      }

      
      const response = await denunciasApi.updateDenuncia(denunciaId, data);
      
      Alert.alert('Sucesso', 'Denúncia atualizada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]);
      
    } catch (error) {
      console.error('Error updating denuncia:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao atualizar denúncia';
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={{ padding: 16, backgroundColor: 'white' }}
      keyboardShouldPersistTaps="handled"
    >
      <View>
        {/* Back arrow on the right */}
        <View style={styles.headerContainer}>
          <Pressable style={styles.backArrowButton} onPress={handleBack}>
            <AntDesign name="close" size={24} color="black" />
          </Pressable>
        </View>

        <View style={styles.formContainer}>
          <Title>Editar Denúncia</Title>

          <FormTextInput
            control={control}
            name="rua_avenida"
            label="Endereço"
            schema={denunciaSchema}
            placeholder="Digite o endereço"
            errors={errors}
          />

          <FormTextInput
            control={control}
            name="numero"
            label="Número"
            schema={denunciaSchema}
            placeholder="Digite o número"
            keyboardType="numeric"
            errors={errors}
          />

          <FormTextInput
            control={control}
            name="bairro"
            label="Bairro"
            schema={denunciaSchema}
            placeholder="Digite o bairro"
            errors={errors}
          />

          <FormTextInput
            control={control}
            name="tipo_imovel"
            label="Tipo de Imóvel"
            schema={denunciaSchema}
            placeholder="Digite o tipo de imóvel"
            errors={errors}
          />

          <FormTextInput
            control={control}
            name="endereco_complemento"
            label="Complemento"
            schema={denunciaSchema}
            placeholder="Ex: Apto 101, Bloco C"
            errors={errors}
          />

          <FormTextInput
            control={control}
            name="observacoes"
            label="Observações"
            schema={denunciaSchema}
            placeholder="Digite as observações"
            multiline={true}
            numberOfLines={4}
            errors={errors}
          />

          <FormPickerInput
            control={control}
            name="status"
            label="Status"
            schema={denunciaSchema}
            errors={errors}
          />

          <View style={styles.buttonContainer}>
            <UiButton
              text="Cancelar"
              onPress={handleBack}
              type="secondary"
              align="left"
            />

            <UiButton
              text={isSubmitting ? "Salvando..." : "Salvar"}
              onPress={handleSubmit(onSubmit)}
              type="primary"
              align="right"
              disabled={isSubmitting}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  backArrowButton: {
    padding: 8,
  },
  formContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
})

export default DenunciaForm

