import { FlatList, Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import StudentCard from './StudentCard'
import { useState, useEffect } from 'react'
import { API_URL } from '@env';
import axios from 'axios';
import { getData } from '../Utility';

export default function ClassDetail() {

  const Separator = () => <View style={{ height: 10 }} />;
  const [studentList, setStudentList] = useState([]);

  const courseCode = "123123"
  useEffect(() => {
    const fetchData = async () => {
      console.log('alo ' + await getData('currentClassId'));
      let currentClassId = await getData('currentClassId');
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_URL}/teacher/get-all-student-of-course?courseId=${currentClassId}`,
        headers: {
          'Authorization': 'Bearer ' + await getData('accessToken')
        }
      };

      axios.request(config)
        .then((response) => {
          console.log(response.data);
          setStudentList(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    console.log('fetching data');
    fetchData();
    console.log('done fetching data');
  }, []);

  return (<>
    <View style={styles.activeBar}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.addButton} onPress={() => console.log('Sửa thông tin lớp pressed')}>
          <Text style={styles.addButtonText}>Tạo form điểm danh</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => console.log('Chụp ảnh điểm danh pressed')}>
          <Text style={styles.addButtonText}>Chụp ảnh điểm danh</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.addButton} onPress={() => console.log('Sửa lớp pressed')}>
          <Text style={styles.addButtonText}>Sửa lớp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => console.log('Xóa lớp pressed')}>
          <Text style={styles.addButtonText}>Xóa lớp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => console.log('Thêm sinh viên pressed')}>
          <Text style={styles.addButtonText}>Thêm sinh viên</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={[styles.container]}>
      <Text style={styles.text1}>Danh sách sinh viên lớp {courseCode}</Text>
    </View>
    <View style={[styles.studentList]}>
      <FlatList
        data={studentList}
        renderItem={({ item }) => (
          <StudentCard student={item} />
        )}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={Separator}
      />
    </View>
  </>
  )
}

const styles = StyleSheet.create({
  text1: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute'
  },
  studentList: {
    flex: 10,
    width: "100%",
    padding: 15
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#66FF99',
    flexDirection: 'row',
  },
  activeBar: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping to multiple lines if needed
    justifyContent: 'space-around', // Distribute buttons evenly
    alignItems: 'center', // Center the buttons vertically
    backgroundColor: '#66FF99',
    padding: 10, // Add some padding for better spacing
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});





  // const studentList = [
  //   {
  //     "id": 22,
  //     "studentCode": "ST202411",
  //     "name": "nam",
  //     "courseCode": "123123",
  //     "numberOfAbsent": 0,
  //     "numberOfPresent": 10
  //   },
  //   {
  //     "id": 23,
  //     "studentCode": "ST202412",
  //     "name": "Hung",
  //     "courseCode": "123123",
  //     "numberOfAbsent": 1,
  //     "numberOfPresent": 9
  //   },
  //   {
  //     "id": 24,
  //     "studentCode": "ST202413",
  //     "name": "Tuan",
  //     "courseCode": "123123",
  //     "numberOfAbsent": 2,
  //     "numberOfPresent": 8
  //   },
  //   {
  //     "id": 25,
  //     "studentCode": "ST202414",
  //     "name": "Long",
  //     "courseCode": "123123",
  //     "numberOfAbsent": 0,
  //     "numberOfPresent": 10
  //   },
  //   {
  //     "id": 26,
  //     "studentCode": "ST202415",
  //     "name": "Minh",
  //     "courseCode": "123123",
  //     "numberOfAbsent": 0,
  //     "numberOfPresent": 10
  //   },
  // ]