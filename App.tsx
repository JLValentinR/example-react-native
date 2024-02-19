import React, {useState, useEffect} from 'react';
import { StyleSheet, ScrollView , View , Text, Image, TextInput, Dimensions } from 'react-native';

function App(){
    const [text, onChangeText] = useState('');
    const [data, setData] = useState({ results: [] });
    const [windowHeight, setWindowHeight] = useState();

    const initialPeticion = (word) => {
      const response = fetch('https://api.mercadolibre.com/sites/MLA/search?q=' + word, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
        }).then((response) => response.json())
      .then((responseJson) => {
        setData(responseJson);
      })
      .catch((error) => {
        console.error('error', error);
      });
    }

    const inputText = (event : string) => {
      onChangeText(event)
    }

    const SearchWord = () => {
      setData({ results: [] })
      initialPeticion(text)
    }

    useEffect(()=>{
      initialPeticion('consolas')
      determineAndSetOrientation();
      Dimensions.addEventListener('change', determineAndSetOrientation);
    },[]);

    const convertidor = (value : number) => {
      return value / 48.95
    }
    
    // Orientación de la pantalla

    const determineAndSetOrientation = () => {
      let width = Dimensions.get('window').width;
      let height = Dimensions.get('window').height;
  
      if (width < height) {
          setWindowHeight(Dimensions.get('window').height - 110);
        } else {
          setWindowHeight(Dimensions.get('window').height - 140);
        }
    }
    
    const listProductos = data.results.map((element, index)=>(
      <View key={index} style={{ width: '100%', height: 120, display: 'flex', flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingTop: 10 }}>
        <View style={{ width: '25%' }}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: element.thumbnail,
            }}
          />
        </View>
        <View style={{ width: '75%', paddingLeft: 10, paddingRight: 10 }}>
          <Text style={styles.textTitle}>{element.title}</Text>
          <Text style={styles.textSeller}>Vendedor: {element.seller.nickname}</Text>
          <Text style={styles.txetPrice}>Precio: $ {convertidor(element.price).toLocaleString('MXN')}</Text>
        </View>
      </View>
    ))
    return (
      <View>
        <View style={styles.backInput}>
          <Text style={styles.textAuthor}>SWEAGHE</Text>
          <TextInput
            style={styles.input}
            onChangeText={inputText}
            onSubmitEditing={SearchWord}
            value={text}
            placeholder='Ingresa una keyword'
          />
        </View>
        <ScrollView style={{ height: windowHeight }}>
          { data.results.length > 0 ? listProductos : <Text style={styles.textCenter}>Buscando Productos ...</Text> }
        </ScrollView>
      </View>
    );
  }

  const styles = StyleSheet.create({
    textAuthor: {
      textAlign: 'center',
      fontSize: 25,
      fontWeight: 'bold',
      color: '#5D6D7E',
      marginTop: 10,
    },
    backInput: {
      backgroundColor: '#5DADE2'
    },
    input: {
      height: 40,
      marginLeft: 12,
      marginRight: 12,
      marginTop: 10,
      marginBottom: 15,
      borderWidth: 0,
      padding: 10,
      backgroundColor: 'white',
      fontSize: 20
    },
    tinyLogo: {
      width: 100,
      height: 100
    },
    textTitle: {
      height: 45,
      fontSize: 20,
      fontWeight: 'bold'
    },
    txetPrice: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'green'
    },
    textSeller: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'coral'
    },
    textCenter:{
      marginTop: 10,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold'
    }
  })
export default App;