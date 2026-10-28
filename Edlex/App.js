import { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';

export default function App() {
  const [pantalla, setPantalla] = useState('inicio');
  const [resultadoQR, setResultadoQR] = useState('');
  const [permiso, solicitarPermiso] = useCameraPermissions();
  const [mensaje, setMensaje] = useState('');
  const [texto, setTexto] = useState('');
  const qrRef = useRef(null); // Para copiar el qr

  return (
    <View style={styles.container}>
      {pantalla === 'inicio' ? (
        <>
          <Text style={styles.title}>Edlex</Text>

          <Text style={styles.subtitle}>Selecciona una opción</Text>
      
          <Pressable
            style={styles.boton}
            onPress={() => {
              setPantalla('leer');
            }}> 
            <Text style={styles.textoBoton}>Escanear código QR</Text>
          </Pressable>
 
          <Pressable
            style={styles.boton}
            onPress={() => {
              setPantalla('generar');
            }}>
            <Text style={styles.textoBoton}>Generar código QR</Text>
          </Pressable>

          <StatusBar style="auto" />
        </>
      ) : pantalla === 'leer' ? (
          <>
            <Text style={styles.subtitle}>Escanear código QR</Text>

            {!permiso ? (
              <Text>Comprobando permiso...</Text>
            ) : !permiso.granted ? (
              <Pressable
                style={styles.boton}
                onPress={solicitarPermiso}
              >
                <Text style={styles.textoBoton}>Permitir acceso a la camara</Text>
              </Pressable>
            ) : (
              <CameraView
                style={{ width: 300, height: 400}}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ['qr'], }}
                onBarcodeScanned={ ({data}) => {
                  {
                    console.log('QR detectado: ', data);
                    setResultadoQR(data);
                  }
                }}
              ></CameraView>
            )}

            <View style={styles.filaTexto}>
              <Text style={styles.texto}>{resultadoQR}</Text>

              <Pressable
                style={styles.boton}
                onPress={async () => {
                  await Clipboard.setStringAsync(resultadoQR);
                  setMensaje('Copiado al portapapeles');
                  setTimeout(() => {
                    setMensaje('');
                  }, 2000);
                }}
              >
                <Text style={styles.textoBoton}>Copiar</Text>
              </Pressable>
            
            </View>

            {mensaje !== '' && (
              <View style={styles.snackbar}>
                <Text style={styles.textoSnackbar}>{mensaje}</Text>
              </View>
            )}

            <Pressable
              style={styles.boton}
              onPress={() => {
                setPantalla('inicio');
                setResultadoQR('');
              }}>
              <Text style={styles.textoBoton}>Inicio</Text>
            </Pressable>
            
            <StatusBar style="auto" />
          </>
      ) : (
          <>
            <Text style={styles.subtitle}>Inserta el texto que deseas convertir en código QR</Text>

            <View style={styles.filaTexto}>
              <TextInput
                style={styles.texto}
                placeholder="Texto o enlace"
                value={texto}
                onChangeText={setTexto}>
              </TextInput>

              <Pressable 
                style={styles.boton}
                onPress={() => {
                  setTexto('');
                }}>
                <Text style={styles.textoBoton}>X</Text>
              </Pressable>
            </View>

            {texto.trim() !== '' && (
              <>
              <QRCode
                value={texto}
                size={200}
                getRef={(c) => (qrRef.current = c)}
              ></QRCode>

              <Pressable
                style={styles.boton}
                onPress={() => {
                  qrRef.current.toDataURL(async (base64) => {
                    await Clipboard.setImageAsync(base64);
                    setMensaje('Copiado al portapapeles');
                    setTimeout(() => setMensaje(''), 2000);
                  });
                }}>
                <Text style={styles.textoBoton}>Copiar</Text>
              </Pressable>
              </>
            )}
            
            {mensaje !== '' && (
              <View style={styles.snackbar}>
                <Text style={styles.textoSnackbar}>{mensaje}</Text>
              </View>
            )}

            <Pressable
              style={styles.boton}
              onPress={() => {
                setPantalla('inicio');
              }}>
              <Text style={styles.textoBoton}>Inicio</Text>
            </Pressable>
            
            <StatusBar style="auto" />
          </>
      )}
       
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001027',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
  },

  title: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: 'bold',
  },
  
  subtitle: {
    color: "#ffffff",
    fontSize: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  texto: {
    flex: 1,
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: 12,
    borderRadius: 10,
  },

  snackbar: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: '#ffffff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 0,
  },

  textoSnackbar: {
    color: '#000000',
    fontSize: 14,
  },

  filaTexto: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    gap: 8,
  },
  
  boton: {
    backgroundColor: '#004150',
    padding: 12,
    borderRadius: 20,
  },

  textoBoton: {
    color: "#ffffff",
    fontSize: 16,
  },
});
