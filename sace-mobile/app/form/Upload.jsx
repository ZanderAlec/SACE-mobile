import React, { useState, useEffect } from 'react'
import {TouchableOpacity, Button, Text, View, StyleSheet} from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';


import { visitSchema } from '@/schemas/visitForm/schema'
import { zodResolver } from "@hookform/resolvers/zod";

import AntDesign from '@expo/vector-icons/AntDesign';

import Title from '@/components/text/Title'
import SubLabel from '@/components/forms/SubLabel';
import Error from '@/components/forms/error';
import UiButton from '@/components/general/UiButton';

const uploadSchema = visitSchema.pick({
  foto:true,
});

function Upload({formHandler}) {
  const {nextStep, prevStep, formData, saveFormData} = formHandler;

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        setValue
    } = useForm({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            foto:{
                uri: "",
                name: "",
                type: "",
                size: 0
            }
        },
    });

    async function pickImage(onChange) {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType,
            quality: 1, // 0 a 1
        });

        if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0]; 

            onChange({
                uri: asset.uri,
                name: asset.uri.split('/').pop(),
                type: 'image/jpeg', // ajustar conforme necessário
                size: asset.fileSize
            });

            trigger("foto");
        }
    }

    useEffect(() => {
      if (formData && formData['upload']) {
        for(const field in formData['upload']) {
          setValue(field, formData['upload'][field]);
        }
      }
    }, [formData, setValue]);

    const onSubmit = (data) => {
        console.log("dados:", data);
        console.log("errors: ", errors);
        
        if (Object.keys(errors).length === 0) {
            // Save the validated data
            saveFormData(data, 'upload');
            nextStep();
        }
    };

  return (
    <View>
        <Title>Upload de arquivos</Title>

        <Controller
        control={control}
        name="foto"
        render={({ field}) => (
            <>
                <SubLabel>Selecione fotos, vídeos ou documentos que complementem o registro de campo:</SubLabel>
                <TouchableOpacity onPress={() => pickImage(field.onChange)}>
                        <View style = {styles.uploadBttm}>
                            <AntDesign name="upload" size={48} color="#72777B" />
                            <Text style = {styles.uploadTxt}>Clique aqui para escolher um arquivo.</Text>
                            <Text style = {styles.uploadSubTxt}>jpeg, png - máx. 50MB</Text>
                        </View>
                </TouchableOpacity>

                <Error error={errors.foto}/>
   
            </>
        )}
      />

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
    uploadBttm: {
        alignItems: 'center',
        borderStyle: 'dotted',
        borderWidth: 2,
        borderColor: '#CAC5CD',
        backgroundColor: "#F2F6FE",
        paddingBlock: 16,
    },

    uploadTxt:{
        color: "#333153",
        fontWeight: '500',
        fontSize: 16,
        marginTop: 16,
    },
    
    uploadSubTxt:{
        color: '#72777B',
        fontSize: 16,
    }
})

export default Upload