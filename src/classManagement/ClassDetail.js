import { FlatList, Text, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import StudentCard from './StudentCard';
import { API_URL } from '@env';
import axios from 'axios';
import { getData, storeData } from '../Utility';
import EditClassModal from './forms/EditClassModal';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import ConfirmDeleteModal from './forms/ConfirmDeleteModal';
import AddStudentModal from './forms/AddStudentModal';
import AddFormModal from './forms/AddFormModal';
import ImageModal from './forms/ImageModal';

export default function ClassDetail() {
  const Separator = () => <View style={{ height: 10 }} />;
  const navigation = useNavigation();
  const [studentList, setStudentList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isAddStudentModalVisible, setAddStudentModalVisible] = useState(false);
  const [isAddFormModalVisible, setAddFormModalVisible] = useState(false);
  const [isCameraModalVisible, setCameraModalVisible] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

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
        if (response.status === 200) {
          storeData('currentClassCode', courseCode);
          storeData('currentClassSubject', subject);
          storeData('currentClassDescription', description);
          fetchData(); // Reload the class details after editing
        }
      })
      .catch((error) => {
        console.log(error);
      });
    console.log('Updated');
    Alert.alert('Lớp học đã được cập nhật');
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
    Alert.alert(`Lớp học ${await getData('currentClassCode')} đã được xóa`);
  };

  const handleAddStudent = async (studentId) => {
    setAddStudentModalVisible(false);
    fetchData();
  };
  const handleCreateForm = ({ expiryTime, question, answer }) => {
    console.log('Form Created:', { expiryTime, question, answer });
    // Add your form creation logic here
    setAddFormModalVisible(false);
  };
  const handlePhotoSubmit = () => {
    setCameraModalVisible(true);
  };

  const clickUpdateClass = () => {
    setModalVisible(true);
  }

  const clickDeleteClass = () => {
    setDeleteModalVisible(true);
  }
  const clickAddStudent = () => {
    setAddStudentModalVisible(true);
  }
  const clickCreateForm = () => {
    navigation.navigate('AddFormScreen');
  }
  const clickImage = () => {
    setCameraModalVisible(true);
  }
  

  return (
    <>
    <View style={styles.classInfoContainer}>
        <Text style={styles.classInfoText}>Mã lớp: {courseCode}</Text>
        <Text style={styles.classInfoText}>Môn học: {subject}</Text>
        <Text style={styles.classInfoText}>Mô tả: {description}</Text>
      </View>
      <View style={styles.activeBar}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addButton} onPress={() => clickCreateForm()}>
            <Text style={styles.addButtonText}>Form điểm danh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => clickImage()}>
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
          <TouchableOpacity style={styles.addButton} onPress={() => clickAddStudent()}>
            <Text style={styles.addButtonText}>Thêm sinh viên</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.container]}>
        <Text style={styles.text1}>Danh sách sinh viên</Text>
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
      <AddStudentModal
        visible={isAddStudentModalVisible}
        onClose={() => setAddStudentModalVisible(false)}
        onSubmit={handleAddStudent}
      />
      <AddFormModal
        visible={isAddFormModalVisible}
        onClose={() => setAddFormModalVisible(false)}
        onSubmit={handleCreateForm}
      />
      <ImageModal
        visible={isCameraModalVisible}
        onClose={() => {
          setCameraModalVisible(false);
          fetchData();
        }}
        onSubmit={handlePhotoSubmit}
        studentList={studentList}
      />
    </>
  );
}

const styles = StyleSheet.create({
  text1: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    color: '#2C3E50', // Màu văn bản tối để dễ đọc
  },
  studentList: {
    flex: 10,
    width: "100%",
    padding: 15,
    backgroundColor: '#ECF0F1', // Màu nền nhẹ nhàng
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#ECF0F1', // Màu nền sáng và hài hòa
    flexDirection: 'row',
  },
  activeBar: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ECF0F1', // Màu nền đậm hơn một chút để tạo sự khác biệt
    //padding: 5, paddingVertical: 10, paddingHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  addButton: {
    backgroundColor: '#34568B', // Màu xanh tươi sáng cho nút
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
    marginVertical: 2,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  classInfoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    borderColor: '#BDC3C7', // Viền nhẹ nhàng để tách biệt
    borderWidth: 1,
    shadowColor: '#000', // Thêm đổ bóng để nổi bật hơn
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  classInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2C3E50', // Màu văn bản đậm để dễ đọc
  },
});
