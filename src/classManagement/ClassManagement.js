import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import ClassCard from './ClassCard'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getData, storeData } from '../Utility'
import { API_URL } from '@env';
import axios from 'axios';

export default function ClassManagement() {
  const Separator = () => <View style={{ height: 10 }} />;
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL}/teacher/get-my-courses`,
      headers: {
        'Authorization': 'Bearer ' + await getData('accessToken')
      }
    };
    axios.request(config)
    .then((response) => {
      console.log(response.data);
      setClasses(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
    };
    console.log('fetching data');
    fetchData();
    console.log('done fetching data');
  }, []);

  const addCourse = async () => {
    console.log('Thêm lớp pressed');
    console.log(await getData('test'));
    console.log(await getData('accessToken'))
  }

  return (
    <>
      <View style={styles.activeBar}>
        <TouchableOpacity style={styles.addButton} onPress={() => addCourse()}>
          <Text style={styles.addButtonText}>Thêm lớp</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.text1}>Các lớp quản lí</Text>
      </View>
      <View style={styles.classList}>
        <FlatList
          data={classes}
          renderItem={({ item }) => <ClassCard classInfo={item} />}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={Separator}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#66FF99',
  },
  text1: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute'
  },
  classList: {
    flex: 10,
    width: "100%",
    padding: 15
  },
  activeBar: {
    backgroundColor: '#66FF99',
    flex: 1,
    flexDirection: 'row', // Ensure items are in a row
    justifyContent: 'center', // Center items horizontally
    alignItems: 'center', // Center items vertically
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});


// const classes = [
  //   {
  //     "id": 1,
  //     "courseCode": "123456",
  //     "subject": "Nhap mon tin hoc dai cuong",
  //     "description": "Lớp IT1 - K65 sáng thứ 2",
  //     "teacher": null,
  //     "createdAt": "2024-04-05T16:05:22.395507Z",
  //     "updatedAt": "2024-04-05T16:05:22.395507Z",
  //     "isActive": true
  //   },
  //   {
  //     "id": 2,
  //     "courseCode": "256984",
  //     "subject": "Kien truc may tinh",
  //     "description": "Lớp IT1 - K65 sáng thứ 3",
  //     "teacher": null,
  //     "createdAt": "2024-04-05T16:05:22.395507Z",
  //     "updatedAt": "2024-04-05T16:05:22.395507Z",
  //     "isActive": true
  //   },
  //   {
  //     "id": 3,
  //     "courseCode": "159648",
  //     "subject": "Co so du lieu",
  //     "description": "Lớp IT1 - K65 sáng thứ 4",
  //     "teacher": null,
  //     "createdAt": "2024-04-05T16:05:22.395507Z",
  //     "updatedAt": "2024-04-05T16:05:22.395507Z",
  //     "isActive": true
  //   }
  // ]