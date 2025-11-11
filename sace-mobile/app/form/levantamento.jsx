import React, { useEffect }	 from 'react'

import {View, Text, StyleSheet, Button} from 'react-native'
import { useForm, useWatch } from 'react-hook-form'


import FormTitle from '../../components/text/FormTitle'
import Title from '../../components/text/Title'
import Deposit from '../../components/forms/Deposit'
import Subtitle from '@/components/text/Subtitle'
import CheckBox from '../../components/forms/checkBox'
import Error from '../../components/forms/error'
import Link from '../../components/text/Link'

import { visitSchema } from '@/schemas/visitForm/schema'
import { zodResolver } from "@hookform/resolvers/zod";

import UiButton from '@/components/general/UiButton'

const settingSchema = visitSchema.pick({
  atividadesRealizadas: true,
  quantDepositos: true,
});


function Levantamento({formHandler, register, isEditing = false}) {

  const {
    df,
    li,
    pe,
    pve,
    deposito,
  } = register || {};

  const disabled = !isEditing;

   const {
      control,
      handleSubmit,
      setValue,
      reset,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(settingSchema),
      defaultValues: {
          atividadesRealizadas: {
            levantamentoIndice: false,
            pontoEstrategico: false,
            tratamento: false,
            delimitacaoFoco: false,
            pesquisaVetorial: false,
          },
          quantDepositos: {
          armazenamentoElevado:0,
          armazenamentoAguaSolo:0,
          dispositivosMoveis:0,
          dispositivosFixos:0,
          pneus:0,
          lixos:0,
          naturais:0,
        }
      },
    });

    const totalquantDeposits = useWatch({
    control,
    name: "quantDepositos",
    defaultValue: {
      armazenamentoElevado: 0,
      armazenamentoAguaSolo: 0,
      dispositivosMoveis: 0,
      dispositivosFixos: 0,
      pneus: 0,
      lixos: 0,
      naturais: 0,
    },
  });

  const {nextStep, prevStep, formData, saveFormData} = formHandler;

  useEffect(() => {
    if (formData && formData['levantamento']) {
      for(const field in formData['levantamento']) {
        setValue(field, formData['levantamento'][field]);
      }
    }
  }, [formData, setValue]);

  useEffect(() => {
    if (register) {
      const values = {
        atividadesRealizadas: {
          levantamentoIndice: typeof li === 'boolean' ? li : false,
          pontoEstrategico: typeof pe === 'boolean' ? pe : false,
          tratamento: (register.larvicidas?.length > 0 || register.adulticidas?.length > 0) ? true : false,
          delimitacaoFoco: typeof df === 'boolean' ? df : false,
          pesquisaVetorial: typeof pve === 'boolean' ? pve : false,
        },
        quantDepositos: {
          armazenamentoElevado: deposito?.a1 || 0,
          armazenamentoAguaSolo: deposito?.a2 || 0,
          dispositivosMoveis: deposito?.b || 0,
          dispositivosFixos: deposito?.c || 0,
          pneus: deposito?.d1 || 0,
          lixos: deposito?.d2 || 0,
          naturais: deposito?.e || 0,
        }
      };
      
      reset(values);
    }
  }, [register, df, li, pe, pve, deposito, reset]);

  const onSubmit = (data) => {
    
    if (Object.keys(errors).length === 0) {
      saveFormData(data, 'levantamento');
      nextStep();
    }
  };



  const totalDeposits = () => {
    return Object.values(totalquantDeposits).reduce((acc, value) => acc + value, 0);
  }

  return (
   <View>
        <FormTitle>Registro do controle do Aedes Aegypti</FormTitle>

        <Title>Levantamento de informações</Title>

        <View style={styles.checkListContainer}> 
          <Subtitle>Selecione as atividades realizadas:</Subtitle>

          <View style={styles.CheckList}>
            <CheckBox
              control={control}
              name="atividadesRealizadas.levantamentoIndice"
              label = "LI - Levantamento de Índice"
              disabled={disabled}
            />
            <CheckBox
              control={control}
              name="atividadesRealizadas.pontoEstrategico"
              label = "PE - Ponto estratégico"
              disabled={disabled}
            />
            <CheckBox
              control={control}
              name="atividadesRealizadas.tratamento"
              label = "T - Tratamento"
              disabled={disabled}
            />
            <CheckBox
              control={control}
              name="atividadesRealizadas.delimitacaoFoco"
              label = "DF - Delimitação de foco"
              disabled={disabled}
            />
            <CheckBox
              control={control}
              name="atividadesRealizadas.pesquisaVetorial"
              label = "PVE - Pesquisa Vetorial Especial"
              disabled={disabled}
            />
          </View>
        </View>
        

        {errors.atividadesRealizadas?._error && (
          <Error error = {errors.atividadesRealizadas._error.message}/> 
        )}

        <Subtitle>Selecione os depósitos encontrados:</Subtitle>
        <Link url = "http://www.rio.rj.gov.br/dlstatic/10112/7753663/4226676/Classificacaodosdepositos.pdf">Ver mais informações</Link>
        
        <View style = {styles.flexRow}>
          <Deposit 
            title = "A1" 
            subtitle="Armazenamento de água elevado" 
            iconType = "armazenamentoAgua"
            control = {control}
            name = "quantDepositos.armazenamentoElevado"
            disabled={disabled}
            />
          <Deposit 
            title = "A2" 
            subtitle="Armazenamento de água em solo"
            iconType = "aguaSolo"
            control = {control}
            name = "quantDepositos.armazenamentoAguaSolo"
            disabled={disabled}
            />

          <Deposit 
            title = "B" 
            subtitle="Dispositivos móveis" 
            iconType = "dispositivosMoveis"
            control = {control}
            name = "quantDepositos.dispositivosMoveis"
            disabled={disabled}
          />
          <Deposit 
            title = "C" 
            subtitle="Dispositivos fixos" 
            iconType = "dipositivosFixos"
            control = {control}
            name = "quantDepositos.dispositivosFixos"
            disabled={disabled}
            />
            
          <Deposit 
            title = "D1" 
            subtitle="Pneus" 
            iconType = "pneus"
            control = {control}
            name = "quantDepositos.pneus"
            disabled={disabled}
          />

          <Deposit 
            title = "D2" 
            subtitle="Lixos" 
            iconType = "lixos"
            control = {control}
            name = "quantDepositos.lixos"
            disabled={disabled}
          />

          <Deposit 
            title = "E" 
            subtitle="Naturais" 
            iconType = "naturais"
            control = {control}
            name = "quantDepositos.naturais"
            disabled={disabled}
          />

        </View>
        
        <Subtitle>Número total de depósitos: <Text style={{fontWeight: 500}}>{totalDeposits()}</Text></Subtitle>

        <View style={styles.flexRow}>
          <UiButton
            text="Voltar" 
            onPress={handleSubmit(prevStep)} 
            type="secondary" 
            align="left"
          />

          <UiButton
            text="Prosseguir" 
            onPress={handleSubmit(onSubmit)} 
            type="primary" 
            align="right"
          />

        </View>
      
   </View>
  )
}

const styles = StyleSheet.create({
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      flexWrap: 'wrap',
      gap: 4,
      marginBlock: 8,
    },
    checkListContainer: {
      marginBlock: 24,
    },

    CheckList:{
      marginBlock: 8,
      paddingLeft: 24,
    }
});

export default Levantamento