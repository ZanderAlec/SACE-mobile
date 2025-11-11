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

function Upload({formHandler, register, isEditing = false}) {

  const {
    arquivos,
  } = register || {};

  const disabled = !isEditing;

  const {nextStep, prevStep, formData, saveFormData} = formHandler;

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        setValue,
        reset
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

    useEffect(() => {
      if (register && arquivos && arquivos.length > 0) {
        // Set foto from first item in arquivos array
        const arquivo = arquivos[0];
        if (arquivo.uri || arquivo.url) {
          reset({
            foto: {
              uri: arquivo.uri || arquivo.url,
              name: arquivo.name || arquivo.filename || arquivo.uri?.split('/').pop() || arquivo.url?.split('/').pop(),
              type: arquivo.type || 'image/jpeg',
              size: arquivo.size || 0
            }
          });
        }
      }
    }, [register, arquivos, reset]);

    const onSubmit = async (data) => {
      
        if (Object.keys(errors).length === 0) {
            // Save the validated data
            saveFormData(data, 'upload');
            
            // Call the submit function from formHandler
            if (formHandler.onSubmit) {
                await formHandler.onSubmit(data);
            } else {
                nextStep();
            }
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
                <TouchableOpacity onPress={() => !disabled && pickImage(field.onChange)} disabled={disabled}>
                        <View style = {[styles.uploadBttm, disabled && styles.disabledUpload]}>
                            <AntDesign name="upload" size={48} color={disabled ? "#938F96" : "#72777B"} />
                            <Text style = {[styles.uploadTxt, disabled && styles.disabledText]}>Clique aqui para escolher um arquivo.</Text>
                            <Text style = {[styles.uploadSubTxt, disabled && styles.disabledText]}>jpeg, png - máx. 50MB</Text>
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
          disabled={formHandler.isSubmitting}
        />

        <UiButton
          text={formHandler.isSubmitting ? "Enviando..." : "Finalizar"} 
          onPress={handleSubmit(onSubmit)} 
          type="primary" 
          align="right"
          disabled={formHandler.isSubmitting}
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
    },

    disabledUpload: {
        opacity: 0.6,
        backgroundColor: "#E6E0E9",
    },

    disabledText: {
        color: '#938F96',
    }
})

export default Upload