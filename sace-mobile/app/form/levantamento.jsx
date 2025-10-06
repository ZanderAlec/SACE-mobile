import React from 'react'

import {View, Text, StyleSheet, Button} from 'react-native'
import { useForm, useWatch} from "react-hook-form";


import FormTitle from '../../components/text/FormTitle'
import Title from '../../components/text/Title'
import Deposit from '../../components/forms/Deposit'
import Subtitle from '@/components/text/Subtitle'

import { visitSchema } from '@/schemas/visitForm/schema'
import { zodResolver } from "@hookform/resolvers/zod";

const settingSchema = visitSchema.pick({
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

        <Subtitle>Selecione os depósitos encontrados:</Subtitle>
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
      marginBlock: 4,
    },
});

export default Levantamento