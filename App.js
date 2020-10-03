import React from 'react'
import { StyleSheet, 
         Text, 
         View, 
         StatusBar, 
         TextInput, 
         Dimensions,
         Platform, 
         ScrollView, 
         AsyncStorage } from 'react-native'
import { AppLoading } from 'expo'        
import ToDo from './ToDo'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

const { height, width } = Dimensions.get("window")

export default class App extends React.Component {
  state = {
    newToDo: '',
    loadedToDos: false,
    toDos:{}
  }
  componentDidMount = () => {
    this._loadToDos()
  }
  render() {
    const {newToDo, loadedToDos, toDos} = this.state;
    //console.log(toDos)
    if(loadedToDos){
        return <AppLoading />
    }
    return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Text style={styles.title}>Fabio To Do</Text>
          <View style={styles.card}>
            <TextInput 
              style={styles.input} 
              placeholder={"New To Do"} 
              value={newToDo} 
              onChangeText={this._controlNewTodo} 
              placeholderTextColor={'#999'}
              returnKeyType={'done'}
              autoCorrect={false}
              onSubmitEditing={this._addToDo} //완료를 클릭할 때 
              underlineColorAndroid={"transparent"}
              />
            <ScrollView contentContainerStyle={styles.toDos}>
              {/* <ToDo text={'Ciao Imma ToDo'}/> */}
              {Object.values(toDos)
                .reverse()
                .map(toDo => 
                <ToDo key={toDo.id} 
                      deleteToDo={this._deleteToDo}
                      completeToDo={this._completeToDo} 
                      uncompleteToDo={this._uncompleteToDo} 
                      updateToDo={this._updateToDo}
                      {...toDo}
                      />)}
            </ScrollView>  
          </View>
        </View>
)}
_controlNewTodo = text => {
  this.setState({
    newToDo: text
  })
  }
_loadToDos = async () => {
  //로딩이 끝나면 loadToDos를 true로 세팅
  try {
    const toDos = await AsyncStorage.getItem("toDos");
    const parsedToDos = JSON.parse(toDos);
    this.setState({ loadedToDos: false, toDos: parsedToDos || {} });
  } catch (err) {
    console.log(err);
  }
  } 
_addToDo = () => {
  const {newToDo} = this.state
  if(newToDo !== ''){
    //prev state를 가져와서 새로운 todo를 추가
    this.setState(prevState => {
      const ID = uuidv4()
      const newToDoObject = {
        [ID]: {
          id: ID,
          isCompleted: false,
          text: newToDo,
          createdAt: Date.now()
        }
      }
      const newState = {
        ...prevState, //whatevert we had before
        newToDo: '', //입력을하고나면 New To Do영역이 빈다
        toDos: {
          ...prevState.toDos,
          ...newToDoObject
        }
      }
      this._saveToDos(newState.toDos)
      return {...newState} //화면에 뿌린다
    })
  }
  }
_deleteToDo = (id) => { //삭제하려면 ID가 필요하다
    this.setState(prevState => {
      const toDos = prevState.toDos; //모든 toDos를 가져온다
      delete toDos[id]; //삭제한다
      const newState = {
        ...prevState,
        ...toDos //삭제한 toDos를 가져온다
      }
      this._saveToDos(newState.toDos)
      return {...newState}
  })
}  
_uncompleteToDo = (id) => {
    this.setState(prevState => {
      const newState={
        ...prevState, //give me you had before
        toDos: {
          ...prevState.toDos,
          [id]: { //if there is an ID
            ...prevState.toDos[id], //overwite it
            isCompleted: false //uncomletetodo 
          }
        }
      }
      this._saveToDos(newState.toDos)
      return {...newState} //show on the screen
    })
}
_completeToDo = (id) => {
  this.setState(prevState => {
    const newState={
      ...prevState,
      toDos: {
        ...prevState.toDos,
        [id]: {
          ...prevState.toDos[id],
          isCompleted: true
        }
      }
    }
    this._saveToDos(newState.toDos)
    return {...newState}
  })
}
_updateToDo = (id, text) => {
  this.setState(prevState => {
    const newState={
      ...prevState, //new to do, loading to do, todos
      toDos: {
        ...prevState.toDos,
        [id]: {
          ...prevState.toDos[id],
          text: text
        }
      }
    }
    this._saveToDos(newState.toDos)
    return {...newState}
    })
  }
_saveToDos = (newToDos) => {
  //console.log(JSON.stringify(newToDos))
  const saveToDos = AsyncStorage.setItem('toDos',JSON.stringify(newToDos)) //toDos - key, value - newToDos
  //AsyncStorage는 오브젝트 저장용이 아니다. String 저장용 -> 오브젝트를 string으로 변환해야함

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDB927',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  title: {
    color:'#fff',
    fontSize: 30,
    marginTop: 60,
    marginBottom: 30,
    fontWeight: '200'
  },
  card: {
    backgroundColor: '#fff',
    flex:1,
    width:width - 25,
    //borderRadius: 10
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor:"rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor:'#bbb',
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos: {
    alignItems: 'center'
  }
});
