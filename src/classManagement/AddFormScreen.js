import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import QuestionModal from './forms/QuestionModal';
import QuestionCard from './QuestionCard';

const AddFormScreen = ({ navigation }) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [questionsList, setQuestionsList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);


  const handleAddQuestion = () => {
    if (question.trim() !== '') {
      setQuestionsList([...questionsList, { question, answers }]);
      setQuestion('');
      setAnswers([]);
      setModalVisible(false);
    }
  };

  const handleSubmit = () => {
    const expiryTime = `${hours}:${minutes}:${seconds}`;
    // Add your form creation logic here, or pass it back to the previous screen
    navigation.goBack(); // Navigate back after form creation
  };

  const toggleCorrectness = (questionIndex, answerIndex) => {
    const newQuestionsList = [...questionsList];
    newQuestionsList[questionIndex].answers[answerIndex].correct = !newQuestionsList[questionIndex].answers[answerIndex].correct;
    setQuestionsList(newQuestionsList);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.modalTitle}>Tạo Form Điểm Danh</Text>
        <Text style={styles.label}>Buổi học số</Text>
        <TextInput style={styles.input} placeholder="Buổi học số" keyboardType="numeric"/>
        <View style={styles.expiryTimeContainer}>
          <Text style={styles.label}>Thời gian hết hạn</Text>
          <View style={styles.timeContainer}>
            <TextInput
              style={styles.timeInput}
              placeholder="Giờ"
              value={hours}
              onChangeText={setHours}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.timeInput}
              placeholder="Phút"
              value={minutes}
              onChangeText={setMinutes}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.timeInput}
              placeholder="Giây"
              value={seconds}
              onChangeText={setSeconds}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.questionHeader}>
          <Text style={styles.label}>Danh sách câu hỏi</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={questionsList}
          renderItem={({ item, index }) => (
            <QuestionCard
              questionInfo={item}
              onPress={() => {
                setUpdateModalVisible(true);
              }}
              toggleCorrectness={(answerIndex) => toggleCorrectness(index, answerIndex)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          style={styles.questionsList}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Tạo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>
      </View>

      <QuestionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        question={question}
        setQuestion={setQuestion}
        answers={answers}
        setAnswers={setAnswers}
        handleAddQuestion={handleAddQuestion}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  expiryTimeContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 18,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    width: '30%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
  },
  addButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: -5,
    bottom: 7,
  },
  questionsList: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF0000',
  },
});

export default AddFormScreen;
