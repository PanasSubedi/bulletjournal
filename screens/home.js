import React, { useState, useEffect } from 'react';
import { View, Modal, Text, StyleSheet, FlatList,
      TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

import EditBulletForm from './components/editBulletForm';

import Card from '../shared/card';

import { retrieveItem, storeNewBullet, storeItem } from '../helpers/storage';

export default function Home(){

  const [date, setDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [formBullet, setFormBullet] = useState({});
  const [addEditText, setAddEditText] = useState('Add');

  const [bullets, setBullets] = useState([]);

  const [updatingDate, setUpdatingDate] = useState(false);

  const [nextID, setNextID] = useState('');

  useEffect(() => {
    retrieveItem('meta').then(metaData => {
      setNextID(metaData.lastInsertBulletID);
    })
  }, []);

  useEffect(() => {
    storeItem('meta', {
      lastInsertBulletID: nextID
    })
  }, [nextID]);

  useEffect(() => {

    retrieveItem('bullets').then(bulletStorageObject => {
      setUpdatingDate(true);
      const dateKey = (date.getMonth()+1).toString() + date.getDate().toString() + date.getFullYear().toString();
      if (bulletStorageObject !== null && dateKey in bulletStorageObject){
        setBullets(bulletStorageObject[dateKey]);
      }
      else {
        setBullets([]);
      }
      setUpdatingDate(false);
    })
  }, [date]);

  useEffect(() => {
    if (!updatingDate){
      const dateKey = (date.getMonth()+1).toString() + date.getDate().toString() + date.getFullYear().toString();
      storeNewBullet(bullets, dateKey);
    }
  }, [bullets]);

  const changeDate = dateOffset => {
    setDate(prevDate => {
      const newDate = new Date(prevDate.toDateString());
      newDate.setDate(newDate.getDate() + dateOffset);
      return newDate;
    })
  }

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(new Date(currentDate));
  }

  const handleButtonPress = newBullet => {
    if (newBullet.id === '0') {
      newBullet.id = nextID;
      newBullet.time = new Date().getHours().toString();

      setNextID(prevNextID => (parseInt(prevNextID)+1).toString());

      setBullets(prevBullets => {
        return [newBullet, ...prevBullets];
      });
    }
    else {
      setBullets(prevBullets => {
        prevBullets.forEach(bullet => {
          if (bullet.id === newBullet.id) {
            bullet.bullet = newBullet.bullet
          }
        });
        return prevBullets;
      })
    }

    setFormBullet({});
    setModalOpen(false);
  }

  const handleEdit = bulletID => {
    setAddEditText('Edit');
    setFormBullet(bullets.filter(bullet => bullet.id===bulletID)[0]);
    setModalOpen(true);
  }

  const handleAdd = () => {
    setAddEditText('Add');
    setFormBullet({id:'0', bullet:''})
    setModalOpen(true);
  }

  const handleDelete = bulletID => {
    setBullets(prevBullets => {
      return prevBullets.filter(bullet => bullet.id!==bulletID);
    })
  }

  const getAddButton = () => (
    <TouchableOpacity onPress={ () => { handleAdd() } }>
      <MaterialIcons
        style={styles.actionIcon}
        size={15}
        color='#555'
        name='add'
      />
    </TouchableOpacity>
  )

  const getDateContent = () => (
    <View style={styles.dateContainer}>
      <Text
        style={styles.dateButton}
        onPress={() => changeDate(-1)}
      >
        &lt;&lt;
      </Text>

      <Text
        style={styles.dateButton}
        onPress={() => {setShowDatePicker(true)}}
      >
        {date.toDateString()}
      </Text>

      <Text
        style={styles.dateButton}
        onPress={() => changeDate(1)}
      >
        &gt;&gt;
      </Text>
    </View>
  );

  return (
    <View style={styles.root}>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Modal visible={modalOpen} animationType='slide'>
          <View style={styles.modalContent}>

            <EditBulletForm handleButtonPress={handleButtonPress} bulletObject={formBullet} addEditText={addEditText} />

            <TouchableOpacity onPress={ () => { setModalOpen(false) } }>
              <MaterialIcons
                style={styles.actionIcon}
                size={15}
                color='#555'
                name='close'
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </TouchableWithoutFeedback>

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

      <FlatList
        ListHeaderComponent={
          <>
            {getDateContent()}
            {getAddButton()}
          </>
        }
        data={bullets}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <Card>
              <Text>{item.time}:00</Text>
              <Text>{item.bullet}</Text>

              <View style={styles.bulletActions}>
                <TouchableOpacity onPress={() => handleEdit(item.id)}>
                  <MaterialIcons
                    name="edit"
                    size={20}
                    color="#777"
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <MaterialIcons
                    name="delete"
                    size={20}
                    color="#777"
                  />
                </TouchableOpacity>
              </View>

            </Card>
        )}
      />

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
