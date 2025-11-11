import { Stack } from 'expo-router';

export default function FormLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        title: '',
        headerBackVisible: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: '',
          headerBackVisible: false,
        }} 
      />
      <Stack.Screen 
        name="DenunciaForm" 
        options={{ 
          headerShown: false,
          title: '',
          headerBackVisible: false,
        }} 
      />
    </Stack>
  );
}

