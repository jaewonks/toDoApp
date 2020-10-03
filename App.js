import React from 'react'
import { StyleSheet, 
         Text, 
         View, 
         StatusBar, 
         TextInput, 
         Dimensions,
         Platform, 
         ScrollView } from 'react-native'
import { AppLoading } from 'expo'        
import ToDo from './ToDo'
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
    console.log(toDos)
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
_loadToDos = () => {
  //로딩이 끝나면 loadToDos를 true로 세팅
  this.setState({
    loadedToDos: true
  })
  } 
_addToDo = () => {
  const {newToDo} = this.state
  if(newToDo !== ''){
/*     this.setState({
      newToDo:'' //텅빈 상태가 되게 하는 것 
    }) */
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
        ...prevState,
        newToDo: '',
        toDos: {
          ...prevState.toDos,
          ...newToDoObject
        }
      }
      return {...newState}
    })
  }
  }
_deleteToDo = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      }
      return {...newState}
  })
}  
_uncompleteToDo = (id) => {
    this.setState(prevState => {
      const newState={
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      }
      return {...newState}
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
    return {...newState}
  })
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
