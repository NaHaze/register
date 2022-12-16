/* eslint-disable prettier/prettier */

import React, {useEffect, useState} from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView
} from 'react-native';

import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm } from 'react-hook-form';
import * as yup from "yup";

export default function App() {  
  
  const [produto, setProduto] = useState('');
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [saveData, setSaveData] = useState([]);
  //useEffect(() => {
  //  register('produto');
  //  register('codigo');
  //  register('descricao');
  //  register('valor');
  //}, [register]);

  //useEffect(() => {
  //  console.log('executado apenas uma vez');
 // }, []);

 async function cadastro() {
  if(produto === '' || codigo === '' || descricao === '', valor === ''){
    Alert.alert("Preencha todos os campos")
    return;
  }
  try {
    const id = uuid.v4();
    const newData = {
      id,
      produto,
      codigo,
      descricao,
      valor
    }
    
    const response = await AsyncStorage.getItem('@app:produtos');
    const previousData = response ? JSON.parse(response) : [];

    const data = [...previousData, newData];

    await AsyncStorage.setItem('@app:produtos', JSON.stringify(data));
    
    setProduto('');
    setCodigo('');
    setDescricao('');
    setValor('');

  } catch (error) {
    console.log(error)
    Alert.alert('Cadastro', 'Não foi possível cadastrar!');
  }
}

  async function buscarProdutos(){
    const response = await AsyncStorage.getItem('@app:produtos');

    const data = response ? JSON.parse(response) : [];
    setSaveData(data);
  } 

  useEffect(() => {
    buscarProdutos()
  }, [saveData]);

  async function handleDelete(id) {
    const response = await AsyncStorage.getItem('@app:produtos');

    const previousData = response ? JSON.parse(response) : [];
    const data = previousData.filter(item => item.id !== id);

    await AsyncStorage.setItem('@app:produtos', JSON.stringify(data));
    setSaveData(data)
  }

    return (

      <>
      <SafeAreaView/>
      <View style={styles.container}>
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        >
          <View styles={styles.content}>
          <Image style={{width:'100%', height:128, justifyContent:'center', marginTop: 30, resizeMode: 'contain' }} source={require('./assets/cesta.png')}/>
          <Text style={styles.title}> Cadastre seu produto:</Text>          
          <TextInput
            style={styles.input}
            onChangeText={setProduto}
            value={produto}
            placeholder="Digite seu produto"
            //onChangeText={text => setValue('codigo', text)}
          />
          <TextInput
            style={styles.input}
            onChangeText={setCodigo}
            value={codigo}
            placeholder="Digite o código"
            //onChangeText={text => setValue('codigo', text)}
          />
          <TextInput
            style={styles.input}
            onChangeText={setDescricao}
            value={descricao}
            placeholder="Digite a descrição do produto"
            //onChangeText={text => setValue('descricao', text)}
          />
          <TextInput
            style={styles.input}
            onChangeText={setValor}
            value={valor}
            placeholder="Digite seu valor"
            //onChangeText={text => setValue('valor', text)}
          />
          <TouchableOpacity style={styles.button} onPress={cadastro}>
            <Text style={styles.buttonText}>Cadastrar Produto</Text>
          </TouchableOpacity>
          </View>
          <ScrollView>
           {saveData.map(item =>(
              <View key={item.id}> 
                <Text>Produto cadastrado: {item.produto}</Text> 
                <Text>Seu código: {item.codigo}</Text> 
                <Text>Descrição: {item.descricao}</Text>
                <Text>Valor: {item.valor}</Text>
                <TouchableOpacity style={styles.button} onPress={() => handleDelete(item.id)}>
                  <Text>Deletar</Text>
                </TouchableOpacity>
              </View>                          
           ))}                    
          </ScrollView>
          
          </KeyboardAvoidingView>
          </View>
          </>
      )
    }
    

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor:'#D3D3D3',
    paddingHorizontal: 18,    
  },
  content:{
    justifyContent: 'center',
    alignItems: 'center',    
  },
  title: {
    fontSize: 25,
    marginBottom: 15,
    color: '#AA9864',
    fontWeight: 'bold',  
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor:'#FFFFFF',
    paddingBottom: 4,
    marginBottom: 8,
    borderRadius: 15,
    color: '#121212',
    textAlign: 'center'
    },
  button: {
    width: '100%',
    height: 45,
    backgroundColor: '#AA9864',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText:{
    color:'#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#65744c',
  },
})