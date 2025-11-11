import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { cyclesApi } from '@/services/api';

function Cycles({setCycle, SetYear}) {

    const [cyclesYear, setCyclesYear] = useState([]);
    const [selectedCycle, setSelectedCycle] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [currentCycle, setCurrentCycle] = useState('');
    const [currentYear, setCurrentYear] = useState('');

    useEffect(() => {
        const fetchCycles = async () => {
            try {
                const data = await cyclesApi.getCycles();
                const keys = Object.keys(data);
                setCyclesYear(data);
                const mostRecentYear = String(keys[keys.length - 1]);
                setCurrentYear(mostRecentYear);
                setSelectedYear(mostRecentYear);
                SetYear(mostRecentYear);
                // Set the last cycle as selected (most recent)
                if (data[mostRecentYear] && data[mostRecentYear].length > 0) {
                    const lastCycleIndex = data[mostRecentYear].length - 1;
                    const lastCycle = String(data[mostRecentYear][lastCycleIndex]);
                    setSelectedCycle(lastCycle);
                    setCurrentCycle(lastCycle);
                    setCycle(lastCycle);
                }
            } catch (error) {
                console.error('Error fetching cycles:', error);
                setCyclesYear([]);
            }
        };

        fetchCycles();
    }, [setCycle, SetYear]);

    const handleCycleChange = (value) => {
        setSelectedCycle(value);
        setCycle(value);
    };

    const handleYearChange = (value) => {
        setSelectedYear(value);
        SetYear(value);
        // Reset cycle to the last one when year changes
        if (cyclesYear[value] && cyclesYear[value].length > 0) {
            const lastCycleIndex = cyclesYear[value].length - 1;
            const lastCycle = String(cyclesYear[value][lastCycleIndex]);
            setSelectedCycle(lastCycle);
            setCurrentCycle(lastCycle);
            setCycle(lastCycle);
        }
    };

    return(
        <View style={styles.cycles}>
            {cyclesYear && selectedYear && Array.isArray(cyclesYear[selectedYear]) && cyclesYear[selectedYear].length > 0 ? (
                <>
                    <Picker
                        selectedValue={selectedYear}
                        onValueChange={handleYearChange}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        {Object.keys(cyclesYear).map((year, index) => {
                            const yearString = String(year);
                            return (
                                <Picker.Item 
                                    key={index} 
                                    label={yearString} 
                                    value={yearString} 
                                />
                            );
                        })}
                    </Picker>
                    
                    <Picker
                        selectedValue={selectedCycle}
                        onValueChange={handleCycleChange}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        {cyclesYear[selectedYear].map((item, index) => {
                            const itemString = String(item);
                            const isCurrent = selectedYear === currentYear && itemString === currentCycle;
                            return (
                                <Picker.Item 
                                    style={styles.pickerItem} 
                                    key={index} 
                                    label={
                                        isCurrent ? `Ciclo ${itemString} (Atual)` : `Ciclo ${itemString}`
                                    } 
                                    value={itemString} 
                                />
                            );
                        })}
                    </Picker>
                </>
            ) : (
                <Text style={styles.loadingText}>Carregando ciclos...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    cycles: {
        marginHorizontal: 8,
        marginBottom: 10,
        padding: 8,
        flexDirection: 'row',
        gap: 10,
    },

    picker: {
        backgroundColor: 'white',
        borderRadius: 16,
        flex: 1,
    },
    pickerItem: {
        color: '#333153',
        fontWeight: '600',
    },
    loadingText: {
        padding: 12,
        textAlign: 'center',
        color: '#666',
    },
})

export default Cycles;

