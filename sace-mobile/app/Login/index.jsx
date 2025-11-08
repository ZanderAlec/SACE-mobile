
import React from 'react'
import { View, Text, StyleSheet, Dimensions, Image, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Title from '@/components/text/Title'
import FormTextInput from '@/components/forms/FormTextInput'
import { loginSchema } from './schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'       
import UiButton from '@/components/general/UiButton'
import Error from '@/components/forms/error'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { router } from 'expo-router'

import authApi from '@/services/api'
import logo from '@/assets/images/sace-logo.png'

function Login() {

    const [errorMessage, setErrorMessage] = useState({message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    
    const { control, 
        handleSubmit, 
        formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = async (data) => {
        setErrorMessage({message: ''});
        setIsLoading(true);

        try {
            const response = await authApi.login(data.username, data.password);
            console.log('Login response:', response);
            
            // Extract token from response - adjust based on your API response structure
            const token = response.token;
            
            if (token) {
                await login(token);
                // Navigate to main app after successful login
                router.replace('/(tabs)');
            } else {
                setErrorMessage({message: 'Erro de conexão. Tente novamente.'});
            }
        } catch (error) {
            console.log('Login error:', error);
            if (error.response?.status === 401) 
                setErrorMessage({message: 'Credenciais inválidas!'});
            else if (error.response?.status === 500) 
                setErrorMessage({message: 'Estamos com problemas no servidor!'});
            else
                setErrorMessage({message: 'Erro de conexão. Tente novamente.'});
        } finally {
            setIsLoading(false);
        }
    }


  return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
             <Image source={logo}/>
            </View>

            <View style={styles.formContainer}>
                    <FormTextInput 
                        control={control}
                        name="username"
                        label="Usuário"
                        placeholder="123.456.789-99"
                        schema={loginSchema}
                        errors={errors}
                    />
                    <FormTextInput 
                        control={control}
                        name="password"
                        label="Senha"
                        placeholder="Digite aqui a senha"
                        schema={loginSchema}
                        errors={errors}
                        secureTextEntry={true}
                    />

                {errorMessage && <Error error={errorMessage} style={styles.error} />}

                <Pressable onPress={handleSubmit(onSubmit)} disabled={isLoading}>
                    <Text style={styles.loginButton}>{isLoading ? "Entrando..." : "Entrar"}</Text>
                </Pressable>
             
            </View>

        </View>
  )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
        paddingTop: 40, // Add padding for status bar
    },
    formContainer: {
        gap: 8,
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '50%',
    },
    
    inputWrapper: {
        flexShrink: 0,
        minHeight: 80,
    },

    error: {
        marginTop: 16,
    },

    loginButton:{
        backgroundColor: '#3B67CE',
        borderRadius: 6,
        padding: 16,
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

    forgotPassword:{
        color: '#3B67CE',
        fontSize: 16,
        textAlign: 'center',
    },

    logoContainer:{
        alignItems: 'center',
        marginBottom: 24,
    }
});

export default Login