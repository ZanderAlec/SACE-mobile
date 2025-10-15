import React, { useState } from 'react'
import {TouchableOpacity, Button, Text, View, StyleSheet} from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';


import { visitSchema } from '@/schemas/visitForm/schema'
import { zodResolver } from "@hookform/resolvers/zod";

import AntDesign from '@expo/vector-icons/AntDesign';

import Title from '@/components/text/Title'
import SubLabel from '@/components/forms/SubLabel';
import Error from '@/components/forms/error';

const uploadSchema = visitSchema.pick({
  foto:true,
});

function Upload() {

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
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

    </View>
  )
}

const styles = StyleSheet.create({
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