import { FlatList, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import StudentCard from './StudentCard';
import { API_URL } from '@env';
import axios from 'axios';
import { getData } from '../Utility';
import EditClassModal from './forms/EditClassModal';
import { useNavigation } from '@react-navigation/native';
import ConfirmDeleteModal from './forms/ConfirmDeleteModal';


export default function ClassDetail() {
  const Separator = () => <View style={{ height: 10 }} />;
  const navigation = useNavigation();  
  const [studentList, setStudentList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setCourseCode(await getData('currentClassCode'));
      setSubject(await getData('currentClassSubject'));
      setDescription(await getData('currentClassDescription'));
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
          setStudentList(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchData();
  }, []);

  const handleEditClass = async (courseCode, subject, description) => {
    console.log('Class Edited:', { courseCode, subject, description });

    let data = JSON.stringify({
      "courseCode": courseCode,
      "subject": subject,
      "description": description
    });

    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `${API_URL}/teacher/update-course?courseId=${await getData('currentClassId')}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await getData('accessToken')
      },
      data: data
    };
    console.log('data: ' + data)

    axios.request(config)
      .then((response) => {
        console.log('Updating');
        console.log(response.data);
        console.log(response.status);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log('Updated');
    setModalVisible(false);
  };

  const handleDeleteClass = async () => {
    let currentClassId = await getData('currentClassId');
    let config = {
      method: 'delete',
      url: `${API_URL}/teacher/delete-course?courseId=${currentClassId}`,
      headers: {
        'Authorization': 'Bearer ' + await getData('accessToken')
      }
    };

    axios.request(config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setDeleteModalVisible(false);
    navigation.navigate('ClassManagement');
  };

  const clickUpdateClass = () => {
    setModalVisible(true);
  }

  const clickDeleteClass = () => {
    setDeleteModalVisible(true);
  }

  return (
    <>
      <View style={styles.activeBar}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addButton} onPress={() => console.log('Tạo form điểm danh pressed')}>
            <Text style={styles.addButtonText}>Tạo form điểm danh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => console.log('Chụp ảnh điểm danh pressed')}>
            <Text style={styles.addButtonText}>Chụp ảnh điểm danh</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addButton} onPress={() => clickUpdateClass()}>
            <Text style={styles.addButtonText}>Sửa lớp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => clickDeleteClass()}>
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
      <EditClassModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleEditClass}
        currentCourseCode={courseCode}
        currentSubject={subject}
        currentDescription={description}
      />
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteClass}
      />
    </>
  );
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
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#66FF99',
    padding: 10,
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
