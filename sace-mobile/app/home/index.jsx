import React, {useState} from 'react'
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'   
import Entypo from '@expo/vector-icons/Entypo';
import AreaScreen from './components/visitArea/AreaScreen';
import RegisterScreen from './components/RegisterScreen';

function Home() {
  const [activeTab, setActiveTab] = useState('areas');

  const tabs = [
   "areas", 
   "registros" 
  ];
  
  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerButtons}>
        <Pressable style={[styles.tab, activeTab === tabs[0] && styles.selectedTab]} onPress={() => handleTabPress(tabs[0])}>
            <Entypo name="location" size={16} color="#333153" />
          <Text style={styles.tabText}>Àreas de visita</Text>
        </Pressable>
        <Pressable style={[styles.tab, activeTab === tabs[1] && styles.selectedTab]} onPress={() => handleTabPress(tabs[1])}>
            <Entypo name="text-document" size={16} color="#333153" />
          <Text style={styles.tabText}>Registros</Text>
        </Pressable>
      </View>

    {/*Search*/}
      {/* <View style={styles.containerContent}></View> */}

      {/* Areas Content */}
      {activeTab === tabs[0] && <AreaScreen />}
      {activeTab === tabs[1] && <RegisterScreen />}
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
    gap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  tab: {
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
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
})

export default Home;