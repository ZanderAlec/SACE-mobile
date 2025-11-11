import React, {useState, useEffect, useMemo} from 'react'
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'   
import AreaScreen from './components/visitArea/AreaScreen';
import RegisterScreen from './components/RegisterScreen';
import DenunciaScreen from './components/DenunciaScreen';
import PerfilScreen from './components/PerfilScreen';
import { useDenuncias } from '@/contexts/DenunciasContext';
import { cyclesApi } from '@/services/api';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import Cycles from './components/Cycles';
import logo from '@/assets/images/sace-logo.png'
import { Image } from 'expo-image';

function Home() {
  const [activeTab, setActiveTab] = useState('areas');

  const [currentCycle, setCurrentCycle] = useState('');
  const [currentYear, setCurrentYear] = useState('');

  const { denuncias, checkForNew } = useDenuncias();
  const pendente = useMemo(() => {
    return denuncias.filter(denuncia => denuncia.status === 'Pendente');
  }, [denuncias]);
  
 
  // Check for new denuncias periodically (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      checkForNew();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [checkForNew]);

  const tabs = [
   "areas", 
   "registros",
   "denuncias",
   "perfil"
  ];
  
  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };



  return (
    <SafeAreaView style={styles.container}>
            
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo}/>
      </View>

      <View style={styles.containerButtons}>
        <Pressable style={[styles.tab, activeTab === tabs[0] && styles.selectedTab]} onPress={() => handleTabPress(tabs[0])}>
            <Entypo name="location" size={16} color="#333153" />
          {activeTab === tabs[0] &&
            <Text style={styles.tabText}>Àreas de visita</Text>
          }
        </Pressable>
        <Pressable style={[styles.tab, activeTab === tabs[1] && styles.selectedTab]} onPress={() => handleTabPress(tabs[1])}>
            <Entypo name="text-document" size={16} color="#333153" />
          {activeTab === tabs[1] &&
            <Text style={styles.tabText}>Registros</Text>
          }
        </Pressable>

        <Pressable 
          style={[styles.tab, activeTab === tabs[2] && styles.selectedTab]} 
          onPress={() => handleTabPress(tabs[2])}
         disabled={pendente.length === 0}
        >
          
          {
          pendente.length > 0 
          ? <MaterialIcons name="notification-important" size={24} color="#333153" />
          : <FontAwesome5 name="bell" size={16} color="#333153" />
          }
          {activeTab === tabs[2] &&
            <Text style={styles.tabText}>Denúncias</Text>
          }
        </Pressable>

        <Pressable 
        style={[styles.tab, activeTab === tabs[3] && styles.selectedTab]} onPress={() => handleTabPress(tabs[3])}
        >
          <FontAwesome name="user-o" size={16} color="black" />
          {activeTab === tabs[3] &&
            <Text style={styles.tabText}>Perfil</Text>
          }
        </Pressable>
      </View>
      { 
         activeTab !== tabs[3] &&
        <Cycles setCycle={setCurrentCycle} SetYear={setCurrentYear} />
      }
      {/* Areas Content */}
      {activeTab === tabs[0] && <AreaScreen />}
      {activeTab === tabs[1] && <RegisterScreen selectedYear={currentYear} selectedCycle={currentCycle} />}
      {activeTab === tabs[2] && <DenunciaScreen />}
      {activeTab === tabs[3] && <PerfilScreen />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fe',
  },
  scrollView: {
    flex: 1,
    marginTop: 10,
  },
  containerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',

  },
  tab: {
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 10,
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
  },

  selectedTab: {
    borderBottomColor: '#3b67ce',
  },

  tabText: {
    color: '#333153',
    fontSize: 16,
    fontWeight: '600',
  },
  containerContent: {
    flex: 1,
    padding: 10,
  },
  loadingText: {
    padding: 12,
    textAlign: 'center',
    color: '#666',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 150,
    height: 60,
    resizeMode: 'contain',
  },
})

export default Home;