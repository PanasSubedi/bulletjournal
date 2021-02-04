import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Button } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import Card from '../shared/card';

import DateTimePicker from '@react-native-community/datetimepicker';

import { retrieveItem } from '../helpers/storage';

export default function Export(){

  const [exporting, setExporting] = useState(false);
  const [exportText, setExportText] = useState('Export');

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (exporting){
      setExportText('Exporting...');
    }
    else {
      setExportText('Export');
    }
  }, [exporting]);

  const exportBullets = (bullets, forAPI) => {
    setExporting(true);
    fetch('https://us-central1-inner-magpie-287105.cloudfunctions.net/downloadJSON', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        data: bullets
      })
    }).then(
      response => response.json()
    ).then(
      data => {
        if (data['response'] == 'success'){
          if (forAPI){
            alert('Export Complete.');
          }
          else {

            Alert.alert(
              'Export Complete',
              'Export Completed. Please download and save the file opened in the browser',
              [
                {
                  text: 'OK',
                  onPress: () => Linking.openURL('https://us-central1-inner-magpie-287105.cloudfunctions.net/downloadJSON')
                },
                {
                  text: 'Cancel'
                }
              ]
            );

          }

          setExporting(false);
        }
      }
    ).catch(
      error => {
        setExporting(false);
      }
    )
  }

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(new Date(currentDate));
  }

  const handleExport = forAPI => {
    retrieveItem('bullets').then(bulletStorageObject => {
      const dateKey = (date.getMonth()+1).toString() + date.getDate().toString() + date.getFullYear().toString();
      if (bulletStorageObject !== null && dateKey in bulletStorageObject){
        exportBullets(bulletStorageObject[dateKey], forAPI);
      }
    })
  }

  return (
    <View style={styles.root}>

      {
        showDatePicker &&
        (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )
      }

      <Card>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text>Export Date: { date.toDateString() }</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <MaterialIcons
              size={15}
              color='#555'
              name='edit'
            />
          </TouchableOpacity>
        </View>
      </Card>

      <Card>
        <TouchableOpacity onPress={() => handleExport(true)}>
          <Text>{exportText} to API</Text>
        </TouchableOpacity>
      </Card>

      <Card>
        <TouchableOpacity onPress={() => handleExport(false)}>
          <Text>{exportText}</Text>
        </TouchableOpacity>
      </Card>

    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  dateContainer: {
    marginVertical: 20,
    marginHorizontal: 50,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dateButton: {
    padding:12,
    borderWidth:0,
    shadowColor: '#000',
    shadowOffset: {width:5, height:5},
    shadowRadius: 2,
    shadowOpacity: 0.8,
    elevation: 2
  },
  bulletActions: {
    borderTopWidth:1,
    borderTopColor:'#999',
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:10,
    paddingTop:10
  },
  actionIcon: {
    marginVertical: 15,
    marginHorizontal: 30,
    paddingVertical: 15,
    textAlign:'center',
    borderWidth: 1,
    borderColor: '#aaa',
    borderStyle: 'dashed',
    borderRadius: 1
  }
})
