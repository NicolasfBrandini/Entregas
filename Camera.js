import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Pressable,
  Alert,
} from "react-native";
import { Camera as CameraAndroid } from "expo-camera"; // CAMERA ANDROID foi feito para nao confudir com o nome da função
import { useEffect, useRef } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { firebaseApp } from "./firebase";

const storage = getStorage(firebaseApp);

export default function Camera(props) {
  const cameraRef = useRef(null);
  useEffect(() => {
    async function permissao() {
      let permissao = await CameraAndroid.requestCameraPermissionsAsync();
      console.log(permissao);
    }

    permissao();
  }, []);

  async function tirarFoto() {
    let imagem = await cameraRef.current.takePictureAsync();
    console.log(imagem);
    Alert.alert(JSON.stringify(imagem));

    let arquivo = await fetch(imagem.uri);
    let binario = await arquivo.blob();

    const foto = ref(storage, "entrega-os1234.jpg");
    await uploadBytes(foto, binario);

    props.exibe(false);
  }
  return (
    <>
      <CameraAndroid style={css.tela} ref={cameraRef}>
        <View>
          <Pressable style={css.btn} onPress={tirarFoto} />
        </View>
      </CameraAndroid>
    </>
  );
}

const css = StyleSheet.create({
  tela: {
    backgroundColor: "white",
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: "absolute",
    top: 0,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  btn: {
    width: 80,
    height: 80,
    backgroundColor: "white",
    bottom: 40,
    borderRadius: 40,
  },
});
