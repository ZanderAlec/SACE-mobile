import React from 'react'

import {View, Text, StyleSheet, Button} from 'react-native'
import { useForm, useWatch} from "react-hook-form";


import FormTitle from '../../components/text/FormTitle'
import Title from '../../components/text/Title'
import Deposit from '../../components/forms/Deposit'
import Subtitle from '@/components/text/Subtitle'
import CheckBox from '../../components/forms/checkBox'
import Error from '../../components/forms/error'
import Link from '../../components/text/Link'

import { visitSchema } from '@/schemas/visitForm/schema'
import { zodResolver } from "@hookform/resolvers/zod";

const settingSchema = visitSchema.pick({
  atividadesRealizadas: true,
  quantDepositos: true,
});


function Levantamento() {
   const {
      control,
      handleSubmit,
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

  const onSubmit = (data) => {
    console.log("dados:", data);
    console.log("errors: ", errors);
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
            />
            <CheckBox
              control={control}
              name="atividadesRealizadas.pontoEstrategico"
              label = "PE - Ponto estratégico"
            />
            <CheckBox
              control={control}
              name="atividadesRealizadas.tratamento"
              label = "T - Tratamento"
            />
            <CheckBox
              control={control}
              name="atividadesRealizadas.delimitacaoFoco"
              label = "DF - Delimitação de foco"
            />
            <CheckBox
              control={control}
              name="atividadesRealizadas.pesquisaVetorial"
              label = "PVE - Pesquisa Vetorial Especial"
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
            />
          <Deposit 
            title = "A2" 
            subtitle="Armazenamento de água em solo"
            iconType = "aguaSolo"
            control = {control}
            name = "quantDepositos.armazenamentoAguaSolo"
            />

          <Deposit 
            title = "B" 
            subtitle="Dispositivos móveis" 
            iconType = "dispositivosMoveis"
            control = {control}
            name = "quantDepositos.dispositivosMoveis"
          />
          <Deposit 
            title = "C" 
            subtitle="Dispositivos fixos" 
            iconType = "dipositivosFixos"
            control = {control}
            name = "quantDepositos.dispositivosFixos"
            />
            
          <Deposit 
            title = "D1" 
            subtitle="Pneus" 
            iconType = "pneus"
            control = {control}
            name = "quantDepositos.pneus"
          />

          <Deposit 
            title = "D2" 
            subtitle="Lixos" 
            iconType = "lixos"
            control = {control}
            name = "quantDepositos.lixos"
          />

          <Deposit 
            title = "E" 
            subtitle="Naturais" 
            iconType = "naturais"
            control = {control}
            name = "quantDepositos.naturais"
          />

        </View>
        
        <Subtitle>Número total de depósitos: <Text style={{fontWeight: 500}}>{totalDeposits()}</Text></Subtitle>

        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        
   </View>
  )
}

const styles = StyleSheet.create({
    formTitle: {
        color: "#3B67CE",
        fontSize: 28,
        textAlign: 'center',
        fontWeight: '500',
    },

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